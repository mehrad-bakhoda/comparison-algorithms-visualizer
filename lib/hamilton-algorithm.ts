export interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
}

export interface Edge {
  from: string;
  to: string;
  id: string;
}

export interface HamiltonCycle {
  path: string[];
  isValid: boolean;
  message: string;
}

export interface HamiltonStep {
  currentNode: string;
  visited: string[];
  path: string[];
  candidates: string[];
  message: string;
}

// Find all Hamilton cycles using backtracking
export function findHamiltonCycles(
  nodes: Node[],
  edges: Edge[],
  maxCycles: number = 10
): HamiltonCycle[] {
  const nodeIds = nodes.map((n) => n.id);
  const adjList = buildAdjacencyList(nodeIds, edges);
  const cycles: HamiltonCycle[] = [];
  const visited = new Set<string>();

  function backtrack(
    current: string,
    path: string[],
    visitedSet: Set<string>,
    startNode: string
  ): void {
    if (cycles.length >= maxCycles) return;

    // If all nodes visited and can return to start
    if (visitedSet.size === nodeIds.length) {
      if (adjList[current]?.includes(startNode)) {
        const cycleStr = [startNode, ...path].join('-');
        if (!visited.has(cycleStr)) {
          visited.add(cycleStr);
          cycles.push({
            path: [startNode, ...path, startNode],
            isValid: true,
            message: `Valid Hamilton cycle: ${cycleStr} → ${startNode}`,
          });
        }
      }
      return;
    }

    // Try each adjacent node
    const neighbors = adjList[current] || [];
    for (const neighbor of neighbors) {
      if (!visitedSet.has(neighbor)) {
        visitedSet.add(neighbor);
        backtrack(neighbor, [...path, neighbor], visitedSet, startNode);
        visitedSet.delete(neighbor);
      }
    }
  }

  // Start from each node
  for (const startNode of nodeIds) {
    const visitedSet = new Set<string>([startNode]);
    backtrack(startNode, [], visitedSet, startNode);
    if (cycles.length >= maxCycles) break;
  }

  return cycles;
}

// Validate a given path is a Hamilton cycle
export function validateHamiltonCycle(
  path: string[],
  nodes: Node[],
  edges: Edge[]
): { isValid: boolean; message: string; issues: string[] } {
  const issues: string[] = [];
  const nodeIds = nodes.map((n) => n.id);
  const adjList = buildAdjacencyList(nodeIds, edges);

  // Check if path is empty
  if (!path || path.length === 0) {
    return {
      isValid: false,
      message: 'Path is empty',
      issues: ['Path contains no nodes'],
    };
  }

  // Check if first and last are the same
  if (path[0] !== path[path.length - 1]) {
    issues.push(
      `Path does not form a cycle: starts at ${path[0]}, ends at ${path[path.length - 1]}`
    );
  }

  // Check if path visits all nodes
  const uniqueNodes = new Set(path.slice(0, -1)); // Exclude last (duplicate of first)
  if (uniqueNodes.size !== nodeIds.length) {
    issues.push(
      `Path visits ${uniqueNodes.size} unique nodes, but graph has ${nodeIds.length} nodes`
    );
  }

  // Check if all nodes in path exist in graph
  for (const node of path) {
    if (!nodeIds.includes(node)) {
      issues.push(`Node '${node}' does not exist in graph`);
    }
  }

  // Check if all edges exist
  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];
    if (!adjList[from]?.includes(to)) {
      issues.push(`Edge from '${from}' to '${to}' does not exist`);
    }
  }

  const isValid = issues.length === 0;
  const message = isValid
    ? `Valid Hamilton cycle! All ${nodeIds.length} nodes visited exactly once.`
    : `Invalid path: ${issues.length} issue${issues.length > 1 ? 's' : ''} found`;

  return { isValid, message, issues };
}

// Build adjacency list from edges
function buildAdjacencyList(
  nodeIds: string[],
  edges: Edge[]
): Record<string, string[]> {
  const adjList: Record<string, string[]> = {};

  // Initialize
  nodeIds.forEach((id) => {
    adjList[id] = [];
  });

  // Add edges
  edges.forEach((edge) => {
    if (!adjList[edge.from]) adjList[edge.from] = [];
    adjList[edge.from].push(edge.to);
  });

  return adjList;
}

// Check if graph is complete (every node connected to every other)
export function isCompleteGraph(nodes: Node[], edges: Edge[]): boolean {
  const n = nodes.length;
  const expectedEdges = n * (n - 1); // For directed graph

  if (edges.length < expectedEdges) return false;

  const nodeIds = nodes.map((n) => n.id);
  const adjList = buildAdjacencyList(nodeIds, edges);

  for (const from of nodeIds) {
    for (const to of nodeIds) {
      if (from !== to && !adjList[from]?.includes(to)) {
        return false;
      }
    }
  }

  return true;
}

// Get basic graph statistics
export function getGraphStats(nodes: Node[], edges: Edge[]) {
  const nodeCount = nodes.length;
  const edgeCount = edges.length;
  const maxEdges = nodeCount * (nodeCount - 1);
  const density = nodeCount > 1 ? (edgeCount / maxEdges * 100).toFixed(2) : 0;

  return {
    nodes: nodeCount,
    edges: edgeCount,
    density: `${density}%`,
    isComplete: isCompleteGraph(nodes, edges),
  };
}
