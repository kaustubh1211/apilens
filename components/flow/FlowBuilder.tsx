'use client';

import { useState, useCallback } from 'react';
import { FlowNode, FlowEdge, FlowMapping, FlowNodeResult } from './Flow';
// import { useFlowExecutor, resolvePath } from './Flow';
// import MappingEditor from './Flow';
import TreeView from '@/components/TreeView';
import RawView from '@/components/RawView';
import {
  Plus, Play, Trash2, ChevronDown, ChevronUp,
  ArrowRight, Zap, Settings, X, CheckCircle2,
  AlertCircle, Loader2, Link2,
} from 'lucide-react';
import { HttpMethod } from '@/types/api';
import MappingEditor from './MappingEditor';
import { useFlowExecutor } from './UserFlowExecutor';
import FlowJourneyMap from './FlowJournyMap';

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'text-emerald-400 bg-emerald-400/10',
  POST: 'text-amber-400 bg-amber-400/10',
  PUT: 'text-blue-400 bg-blue-400/10',
  DELETE: 'text-red-400 bg-red-400/10',
};

function makeNode(label: string): FlowNode {
  return {
    id: crypto.randomUUID(),
    label,
    url: '',
    method: 'GET',
    headers: [],
    inputMappings: [],
  };
}

function StatusIcon({ status }: { status: FlowNodeResult['status'] }) {
  if (status === 'running') return <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />;
  if (status === 'success') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
  if (status === 'error') return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
  return <div className="w-3.5 h-3.5 rounded-full border border-neutral-700" />;
}

interface NodeCardProps {
  node: FlowNode;
  index: number;
  result?: FlowNodeResult;
  prevNode?: FlowNode;
  prevResult?: FlowNodeResult;
  edge?: FlowEdge;
  onUpdate: (updated: FlowNode) => void;
  onDelete: () => void;
  onEdgeUpdate: (edge: FlowEdge) => void;
}

function NodeCard({ node, index, result, prevNode, prevResult, edge, onUpdate, onDelete, onEdgeUpdate }: NodeCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [showMapping, setShowMapping] = useState(false);
  const [responseView, setResponseView] = useState<'tree' | 'raw'>('tree');

  const resolvedUrl = result?.resolvedUrl ?? node.url;
  const mappingCount = edge?.mappings.length ?? 0;

  return (
    <div className="relative">
      {/* Connector from previous node */}
      {index > 0 && (
        <div className="flex items-center mb-3">
          <div className="flex-1 border-t border-dashed border-neutral-800" />
          <button
            onClick={() => setShowMapping(v => !v)}
            className="flex items-center gap-1.5 mx-3 px-2.5 py-1 rounded-full border border-neutral-800 bg-neutral-950 hover:border-neutral-600 transition-colors text-xs text-neutral-400 hover:text-neutral-200"
          >
            <Link2 className="w-3 h-3" />
            {mappingCount > 0
              ? `${mappingCount} mapping${mappingCount > 1 ? 's' : ''}`
              : 'Map data'}
          </button>
          <div className="flex-1 border-t border-dashed border-neutral-800" />
        </div>
      )}

      {/* Mapping panel */}
      {showMapping && prevNode && (
        <div className="mb-3 bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-neutral-400 font-medium flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5" />
              Data from <span className="text-white">{prevNode.label}</span>
              <ArrowRight className="w-3 h-3" />
              <span className="text-white">{node.label}</span>
            </p>
            <button onClick={() => setShowMapping(false)} className="text-neutral-600 hover:text-neutral-400">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <MappingEditor
            fromNodeLabel={prevNode.label}
            toNodeLabel={node.label}
            sourceData={prevResult?.response?.data}
            mappings={edge?.mappings ?? []}
            onChange={mappings => {
              onEdgeUpdate({
                fromNodeId: prevNode.id,
                toNodeId: node.id,
                mappings,
              });
            }}
          />
          {!prevResult?.response && (
            <p className="text-xs text-neutral-600 mt-3 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Run the flow first to see available fields from {prevNode.label}
            </p>
          )}
        </div>
      )}

      {/* Node card */}
      <div className="bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-900">
          <StatusIcon status={result?.status ?? 'idle'} />
          <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${METHOD_COLORS[node.method]}`}>
            {node.method}
          </span>
          <span className="text-sm text-neutral-300 font-medium flex-1 min-w-0 truncate">
            {node.label}
          </span>
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => setExpanded(v => !v)}
              className="p-1 text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-neutral-600 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {expanded && (
          <div className="p-4 space-y-3">
            {/* Label */}
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Node label</label>
              <input
                value={node.label}
                onChange={e => onUpdate({ ...node, label: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-1.5 text-sm text-neutral-300 focus:outline-none focus:border-neutral-600"
              />
            </div>

            {/* Method + URL */}
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Request</label>
              <div className="flex gap-2">
                <select
                  value={node.method}
                  onChange={e => onUpdate({ ...node, method: e.target.value as HttpMethod })}
                  className="bg-neutral-900 border border-neutral-800 rounded-md px-3 py-1.5 text-sm text-neutral-300 focus:outline-none focus:border-neutral-600"
                >
                  {(['GET', 'POST', 'PUT', 'DELETE'] as HttpMethod[]).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <input
                  value={node.url}
                  onChange={e => onUpdate({ ...node, url: e.target.value })}
                  placeholder="https://api.example.com/products/{id}"
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-md px-3 py-1.5 text-sm font-mono text-neutral-300 focus:outline-none focus:border-neutral-600"
                />
              </div>
              {edge && edge.mappings.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {edge.mappings.map(m => (
                    <span key={m.id} className="text-xs font-mono bg-blue-400/10 text-blue-400 px-2 py-0.5 rounded">
                      {`{${m.toParam}}`}
                    </span>
                  ))}
                  <span className="text-xs text-neutral-600 self-center">will be substituted</span>
                </div>
              )}
            </div>

            {/* Result resolved URL if different */}
            {result?.resolvedUrl && result.resolvedUrl !== node.url && (
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Resolved URL</label>
                <p className="text-xs font-mono text-emerald-400 bg-emerald-400/5 border border-emerald-400/20 rounded-md px-3 py-1.5">
                  {result.resolvedUrl}
                </p>
              </div>
            )}

            {/* Body (POST/PUT) */}
            {(node.method === 'POST' || node.method === 'PUT') && (
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Request body (JSON)</label>
                <textarea
                  value={node.body ?? ''}
                  onChange={e => onUpdate({ ...node, body: e.target.value })}
                  placeholder={'{\n  "key": "{value}"\n}'}
                  rows={3}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-1.5 text-xs font-mono text-neutral-300 focus:outline-none focus:border-neutral-600 resize-y"
                />
              </div>
            )}

            {/* Response */}
            {result?.status === 'success' && result.response && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-neutral-500">Response</label>
                    <span className="text-xs text-emerald-400 font-mono">
                      {result.response.status} · {result.response.time}ms · {(result.response.size / 1024).toFixed(1)}kb
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {(['tree', 'raw'] as const).map(v => (
                      <button
                        key={v}
                        onClick={() => setResponseView(v)}
                        className={`text-xs px-2 py-0.5 rounded transition-colors ${
                          responseView === v
                            ? 'bg-neutral-800 text-neutral-200'
                            : 'text-neutral-600 hover:text-neutral-400'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="max-h-64 overflow-auto custom-scrollbar border border-neutral-900 rounded-lg">
                  {responseView === 'tree'
                    ? <TreeView data={result.response.data} searchQuery="" />
                    : <RawView data={result.response.data} />
                  }
                </div>
              </div>
            )}

            {result?.status === 'error' && (
              <div className="bg-red-400/5 border border-red-400/20 rounded-lg px-3 py-2 text-xs text-red-400">
                {result.error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FlowBuilder() {
  const { state, setNodes, setEdges, runFlow } = useFlowExecutor();
  const [edges, setLocalEdges] = useState<FlowEdge[]>([]);

  const nodes = state.nodes;

  const addNode = () => {
    const newNode = makeNode(`API ${nodes.length + 1}`);
    setNodes([...nodes, newNode]);
  };

  const updateNode = useCallback((index: number, updated: FlowNode) => {
    const next = [...nodes];
    next[index] = updated;
    setNodes(next);
  }, [nodes, setNodes]);

  const deleteNode = useCallback((index: number) => {
    const deletedId = nodes[index].id;
    const next = nodes.filter((_, i) => i !== index);
    setNodes(next);
    // remove edges connected to deleted node
    const nextEdges = edges.filter(e => e.fromNodeId !== deletedId && e.toNodeId !== deletedId);
    setLocalEdges(nextEdges);
    setEdges(nextEdges);
  }, [nodes, edges, setNodes, setEdges]);

  const updateEdge = useCallback((edge: FlowEdge) => {
    const next = [
      ...edges.filter(e => !(e.fromNodeId === edge.fromNodeId && e.toNodeId === edge.toNodeId)),
      edge,
    ];
    setLocalEdges(next);
    setEdges(next);
  }, [edges, setEdges]);

  const getEdge = (toNodeId: string) =>
    edges.find(e => e.toNodeId === toNodeId);

  const handleRun = () => {
    // Sync edges to executor before running
    setEdges(edges);
    runFlow();
  };

  const hasNodes = nodes.length > 0;
  const canRun = nodes.length > 0 && nodes.every(n => n.url.trim()) && !state.isRunning;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={addNode}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add API node
        </button>

        {hasNodes && (
          <button
            onClick={handleRun}
            disabled={!canRun}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-neutral-900 font-medium transition-colors"
          >
            {state.isRunning
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Play className="w-4 h-4" />
            }
            {state.isRunning ? 'Running…' : 'Run flow'}
          </button>
        )}

        {hasNodes && (
          <span className="text-xs text-neutral-600 ml-auto">
            {nodes.length} node{nodes.length > 1 ? 's' : ''}
            {edges.length > 0 && ` · ${edges.length} connection${edges.length > 1 ? 's' : ''}`}
          </span>
        )}
      </div>

      {/* Empty state */}
      {!hasNodes && (
        <div className="border border-dashed border-neutral-800 rounded-lg py-16 text-center">
          <Zap className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-500 text-sm mb-1">Build an API flow</p>
          <p className="text-neutral-700 text-xs">
            Chain multiple APIs and pass data between them
          </p>
          <button
            onClick={addNode}
            className="mt-4 px-4 py-2 text-sm bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-400 transition-colors"
          >
            Add first node
          </button>
        </div>
      )}

      {/* Flow nodes */}
      {nodes.length > 0 && (
        <div className="space-y-0">
          {nodes.map((node, i) => (
            <NodeCard
              key={node.id}
              node={node}
              index={i}
              result={state.results[node.id]}
              prevNode={i > 0 ? nodes[i - 1] : undefined}
              prevResult={i > 0 ? state.results[nodes[i - 1].id] : undefined}
              edge={getEdge(node.id)}
              onUpdate={updated => updateNode(i, updated)}
              onDelete={() => deleteNode(i)}
              onEdgeUpdate={updateEdge}
            />
          ))}
        </div>
      )}

      {/* Add more nodes at bottom */}
      {nodes.length > 0 && (
        <button
          onClick={addNode}
          className="w-full py-2 border border-dashed border-neutral-800 rounded-lg text-xs text-neutral-600 hover:text-neutral-400 hover:border-neutral-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          Add another API node
        </button>
      )}
      
       {
       
       Object.values(state.results).some(r => r.status === 'success') && (
        
      <FlowJourneyMap
        nodes={state.nodes}
        edges={edges}
        results={state.results}
      />
    )}
    </div>
  );
}