import { useState, useCallback } from 'react';
import { FlowNode, FlowEdge, FlowNodeResult, FlowState } from './Flow';
import { fetchApi } from '@/services/apiClient';

// Resolve a dot-path like "[0].id" or "results.data.name" from an object
function resolvePath(obj: any, path: string): any {
  if (!path || obj == null) return undefined;
  // Handle array index notation [0] and dot notation
  const normalized = path.replace(/\[(\d+)\]/g, '.$1');
  return normalized.split('.').filter(Boolean).reduce((acc, key) => {
    return acc != null ? acc[key] : undefined;
  }, obj);
}

// Interpolate {param} placeholders in a string using resolved values
function interpolate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
}

// Topological sort — returns node ids in execution order
function topoSort(nodes: FlowNode[], edges: FlowEdge[]): string[] {
  const order: string[] = [];
  const visited = new Set<string>();

  function visit(id: string) {
    if (visited.has(id)) return;
    visited.add(id);
    // visit all nodes that this node depends on first
    edges
      .filter(e => e.toNodeId === id)
      .forEach(e => visit(e.fromNodeId));
    order.push(id);
  }

  nodes.forEach(n => visit(n.id));
  return order;
}

export function useFlowExecutor() {
  const [state, setState] = useState<FlowState>({
    nodes: [],
    edges: [],
    results: {},
    isRunning: false,
  });

  const setNodes = useCallback((nodes: FlowNode[]) => {
    setState(s => ({ ...s, nodes }));
  }, []);

  const setEdges = useCallback((edges: FlowEdge[]) => {
    setState(s => ({ ...s, edges }));
  }, []);

  const runFlow = useCallback(async () => {
    setState(s => ({
      ...s,
      isRunning: true,
      results: Object.fromEntries(
        s.nodes.map(n => [n.id, { nodeId: n.id, status: 'idle' as const }])
      ),
    }));

    const { nodes, edges } = state;
    const executionOrder = topoSort(nodes, edges);
    const responseCache: Record<string, any> = {};

    for (const nodeId of executionOrder) {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) continue;

      // Mark running
      setState(s => ({
        ...s,
        results: {
          ...s.results,
          [nodeId]: { nodeId, status: 'running' },
        },
      }));

      try {
        // Build resolved param values from all incoming edges
        const resolvedParams: Record<string, string> = {};
        const incomingEdges = edges.filter(e => e.toNodeId === nodeId);

        for (const edge of incomingEdges) {
          const sourceResponse = responseCache[edge.fromNodeId];
          if (!sourceResponse) continue;

          for (const mapping of edge.mappings) {
            const value = resolvePath(sourceResponse, mapping.fromPath);
            if (value !== undefined) {
              resolvedParams[mapping.toParam] = String(value);
            }
          }
        }

        // Interpolate URL
        const resolvedUrl = interpolate(node.url, resolvedParams);

        // Build headers
        const headerObj = Object.fromEntries(
          node.headers.filter(h => h.key && h.value).map(h => [
            interpolate(h.key, resolvedParams),
            interpolate(h.value, resolvedParams),
          ])
        );

        // Build body (for POST/PUT)
        let bodyObj: Record<string, any> | undefined;
        if (node.body) {
          try {
            const interpolatedBody = interpolate(node.body, resolvedParams);
            bodyObj = JSON.parse(interpolatedBody);
          } catch {
            // Not JSON, send as-is
          }
        }

        const start = Date.now();
        const result = await fetchApi({
          url: resolvedUrl,
          method: node.method,
          headers: headerObj,
          ...(bodyObj ? { body: bodyObj } : {}),
        });

        const response = {
          data: result.data,
          status: result.status || 200,
          size: result.size || JSON.stringify(result.data).length,
          time: Date.now() - start,
        };

        responseCache[nodeId] = result.data;

        setState(s => ({
          ...s,
          results: {
            ...s.results,
            [nodeId]: { nodeId, status: 'success', response, resolvedUrl },
          },
        }));
      } catch (err: any) {
        setState(s => ({
          ...s,
          results: {
            ...s.results,
            [nodeId]: { nodeId, status: 'error', error: err.message },
          },
        }));
        // Stop on error
        break;
      }
    }

    setState(s => ({ ...s, isRunning: false }));
  }, [state]);

  return { state, setNodes, setEdges, runFlow };
}

export { resolvePath };