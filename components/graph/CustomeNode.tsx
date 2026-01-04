'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export default memo(({ data }: NodeProps) => {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg min-w-[160px] max-w-[280px]">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white" 
      />
      
      <div className="p-3">
        {data.type === 'object' && (
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 pb-2 border-b border-gray-200">
              {data.label}
            </div>
            {data.fields && data.fields.map((field: any, i: number) => (
              <div key={i} className="flex gap-2 text-xs">
                <span className="text-gray-600 font-semibold shrink-0">{field.key}:</span>
                <span className="text-gray-900 font-mono truncate">{field.value}</span>
              </div>
            ))}
            {data.moreCount > 0 && (
              <div className="text-xs text-gray-500 pt-1 border-t border-gray-100 mt-2">
                +{data.moreCount} more fields
              </div>
            )}
          </div>
        )}

        {data.type === 'array' && (
          <div className="space-y-1">
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              {data.label}
            </div>
            <div className="text-sm text-gray-900 font-mono font-semibold">
              [{data.count} items]
            </div>
          </div>
        )}

        {data.type === 'primitive' && (
          <div className="space-y-1">
            <div className="text-xs font-bold text-gray-600">
              {data.label}
            </div>
            <div className="text-sm text-gray-900 font-mono break-all">
              {data.value}
            </div>
          </div>
        )}
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white" 
      />
    </div>
  );
});

