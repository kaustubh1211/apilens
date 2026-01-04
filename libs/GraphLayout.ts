import { Node, Edge } from 'reactflow';

interface TreeNode {
  id: string;
  data: any;
  children: TreeNode[];
  width: number;
  height: number;
}

export function convertDataToGraph(data: any): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let nodeId = 0;

  const HORIZONTAL_SPACING = 280;
  const VERTICAL_SPACING = 120;

  function createTreeNode(value: any, label: string, parentId?: string): TreeNode {
    const id = `node-${nodeId++}`;
    const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
    const isArray = Array.isArray(value);
    const isPrimitive = !isObject && !isArray;

    let nodeData: any = { label };
    let children: TreeNode[] = [];

    if (isPrimitive) {
      nodeData = {
        type: 'primitive',
        label,
        value: String(value),
      };
    } else if (isArray) {
      nodeData = {
        type: 'array',
        label,
        count: value.length,
      };

      // Limit array items shown
      const maxItems = 8;
      value.slice(0, maxItems).forEach((item: any, index: number) => {
        children.push(createTreeNode(item, `[${index}]`, id));
      });
    } else if (isObject) {
      const entries = Object.entries(value);
      const primitiveFields = entries
        .filter(([_, v]) => typeof v !== 'object' || v === null)
        .slice(0, 4)
        .map(([k, v]) => ({
          key: k,
          value: v === null ? 'null' : JSON.stringify(v).slice(0, 30),
        }));

      nodeData = {
        type: 'object',
        label,
        fields: primitiveFields,
        moreCount: Math.max(0, entries.length - primitiveFields.length),
      };

      // Add nested objects/arrays as children
      const nestedEntries = entries.filter(([_, v]) => typeof v === 'object' && v !== null);
      nestedEntries.slice(0, 6).forEach(([key, childValue]) => {
        children.push(createTreeNode(childValue, key, id));
      });
    }

    // Create edge from parent
    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${id}`,
        source: parentId,
        target: id,
        type: 'smoothstep',
        style: { stroke: '#374151', strokeWidth: 2 },
        animated: false,
      });
    }

    return {
      id,
      data: nodeData,
      children,
      width: 200,
      height: 80,
    };
  }

  function calculatePositions(
    node: TreeNode,
    x: number,
    y: number,
    positions: Map<string, { x: number; y: number }>
  ): number {
    positions.set(node.id, { x, y });

    if (node.children.length === 0) {
      return node.width;
    }

    let currentX = x;
    const childY = y + VERTICAL_SPACING;

    node.children.forEach((child) => {
      const childWidth = calculatePositions(child, currentX, childY, positions);
      currentX += childWidth + HORIZONTAL_SPACING;
    });

    const totalWidth = currentX - x - HORIZONTAL_SPACING;
    const centerX = x + totalWidth / 2;

    // Re-center parent
    positions.set(node.id, { x: centerX, y });

    return totalWidth;
  }

  function addNodesToArray(node: TreeNode, positions: Map<string, { x: number; y: number }>) {
    const pos = positions.get(node.id)!;
    
    nodes.push({
      id: node.id,
      type: 'custom',
      data: node.data,
      position: { x: pos.x, y: pos.y },
    });

    node.children.forEach((child) => addNodesToArray(child, positions));
  }

  // Build tree
  const tree = createTreeNode(data, 'root');

  // Calculate positions
  const positions = new Map<string, { x: number; y: number }>();
  calculatePositions(tree, 0, 0, positions);

  // Create nodes array
  addNodesToArray(tree, positions);

  return { nodes, edges };
}