export interface AnalysisResult {
  type: 'array' | 'object' | 'primitive';
  suggestedView: 'tree' | 'table' | 'raw';
  itemCount?: number;
  depth: number;
  keys?: string[];
}

export function analyzeData(data: any): AnalysisResult {
  const type = getDataType(data);
  const depth = calculateDepth(data);

  // Array of objects → Table view
  if (Array.isArray(data) && data.length > 0) {
    // Check if at least some items are objects (to justify a table view)
    const hasObjects = data.some(item => 
      typeof item === 'object' && 
      item !== null && 
      !Array.isArray(item)
    );

    if (hasObjects) {
      // Collect all keys from all objects to see what columns we might have
      const allKeys = new Set<string>();
      data.forEach(item => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          Object.keys(item).forEach(key => allKeys.add(key));
        }
      });

      return {
        type: 'array',
        suggestedView: 'table',
        itemCount: data.length,
        depth,
        keys: Array.from(allKeys),
      };
    }

    return {
      type: 'array',
      suggestedView: 'tree',
      itemCount: data.length,
      depth,
    };
  }

  // Nested object → Tree view
  if (type === 'object') {
    return {
      type: 'object',
      suggestedView: 'tree',
      depth,
      keys: Object.keys(data),
    };
  }

  // Primitive → Raw view
  return {
    type: 'primitive',
    suggestedView: 'raw',
    depth: 0,
  };
}

function getDataType(data: any): 'array' | 'object' | 'primitive' {
  if (data === null || data === undefined) return 'primitive';
  if (Array.isArray(data)) return 'array';
  if (typeof data === 'object') return 'object';
  return 'primitive';
}

function calculateDepth(obj: any, currentDepth = 0): number {
  if (typeof obj !== 'object' || obj === null) {
    return currentDepth;
  }

  let maxDepth = currentDepth;

  for (const key in obj) {
    const depth = calculateDepth(obj[key], currentDepth + 1);
    maxDepth = Math.max(maxDepth, depth);
  }

  return maxDepth;
}