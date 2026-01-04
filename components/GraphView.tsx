'use client';

import { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomeNode from './graph/CustomeNode';
import { convertDataToGraph } from '@/libs/GraphLayout';

const nodeTypes = {
  custom: CustomeNode,
};

interface GraphViewProps {
  data: any;
}

function GraphViewInner({ data }: GraphViewProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => convertDataToGraph(data),
    [data]
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          minZoom: 0.5,
          maxZoom: 1,
        }}
        minZoom={0.3}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        className="bg-white"
      >
        <Background color="#e5e7eb" gap={16} size={1} />
        <Controls 
          className="!bg-white !border-2 !border-gray-300 !rounded-lg !shadow-lg overflow-hidden"
          style={{
            button: {
              backgroundColor: 'white',
              borderBottom: '1px solid #e5e7eb',
              color: '#374151',
            }
          }}
        />
        <MiniMap
          nodeColor="#f3f4f6"
          maskColor="rgba(255, 255, 255, 0.8)"
          className="!bg-white !border-2 !border-gray-300 !rounded-lg !shadow-lg"
        />
      </ReactFlow>
    </div>
  );
}

export default function GraphView({ data }: GraphViewProps) {
  return (
    <ReactFlowProvider>
      <GraphViewInner data={data} />
    </ReactFlowProvider>
  );
}