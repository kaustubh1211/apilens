import { HttpMethod, ApiResponse } from '@/types/api';

export interface FlowMapping {
  id: string;
  fromPath: string;       // e.g. "[0].id" or "data.userId"
  toParam: string;        // e.g. "id" — matches {id} in URL or body key
  toTarget: 'url' | 'body' | 'header';
}

export interface FlowNode {
  id: string;
  label: string;
  url: string;
  method: HttpMethod;
  headers: Array<{ key: string; value: string }>;
  body?: string;
  // mappings coming INTO this node from previous nodes
  inputMappings: FlowMapping[];
}

export interface FlowEdge {
  fromNodeId: string;
  toNodeId: string;
  mappings: FlowMapping[];
}

export type FlowNodeStatus = 'idle' | 'running' | 'success' | 'error';

export interface FlowNodeResult {
  nodeId: string;
  status: FlowNodeStatus;
  response?: ApiResponse;
  error?: string;
  resolvedUrl?: string;
}

export interface FlowState {
  nodes: FlowNode[];
  edges: FlowEdge[];
  results: Record<string, FlowNodeResult>;
  isRunning: boolean;
}