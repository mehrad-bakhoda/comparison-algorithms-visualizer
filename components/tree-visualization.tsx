'use client';

import React from 'react';

interface HuffmanNode {
  char?: string;
  freq: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
  id: string;
}

interface TreeVisualizationProps {
  tree?: HuffmanNode;
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ tree }) => {
  if (!tree) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        Build a tree to see the visualization
      </div>
    );
  }

  const getTreeDimensions = (
    node: HuffmanNode | undefined,
    depth: number = 0
  ): { width: number; height: number } => {
    if (!node) return { width: 0, height: 0 };
    if (!node.left && !node.right) return { width: 80, height: 100 };

    const leftDim = getTreeDimensions(node.left, depth + 1);
    const rightDim = getTreeDimensions(node.right, depth + 1);

    return {
      width: leftDim.width + rightDim.width + 40,
      height: Math.max(leftDim.height, rightDim.height) + 100,
    };
  };

  const dimensions = getTreeDimensions(tree);
  const svgWidth = Math.max(dimensions.width, 400);
  const svgHeight = Math.max(dimensions.height, 300);

  const drawNode = (
    node: HuffmanNode | undefined,
    x: number,
    y: number,
    offset: number
  ): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];

    if (!node) return elements;

    const nodeRadius = 30;
    const verticalGap = 100;

    // Draw edges to children
    if (node.left) {
      const leftX = x - offset / 2;
      elements.push(
        <line
          key={`line-left-${node.id}`}
          x1={x}
          y1={y}
          x2={leftX}
          y2={y + verticalGap}
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground"
        />
      );
      elements.push(
        ...drawNode(node.left, leftX, y + verticalGap, offset / 2)
      );
    }

    if (node.right) {
      const rightX = x + offset / 2;
      elements.push(
        <line
          key={`line-right-${node.id}`}
          x1={x}
          y1={y}
          x2={rightX}
          y2={y + verticalGap}
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground"
        />
      );
      elements.push(
        ...drawNode(node.right, rightX, y + verticalGap, offset / 2)
      );
    }

    // Draw node circle
    const isLeaf = !node.left && !node.right;
    elements.push(
      <circle
        key={`circle-${node.id}`}
        cx={x}
        cy={y}
        r={nodeRadius}
        fill="currentColor"
        className={isLeaf ? 'text-accent' : 'text-primary'}
      />
    );

    // Draw text
    const displayText = node.char || node.freq.toFixed(2);
    elements.push(
      <text
        key={`text-${node.id}`}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-bold fill-white"
        pointerEvents="none"
      >
        {displayText}
      </text>
    );

    return elements;
  };

  return (
    <svg
      width="100%"
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="border border-border/30 rounded-lg bg-secondary/5"
    >
      {drawNode(tree, svgWidth / 2, 40, svgWidth / 3)}
    </svg>
  );
};

export default TreeVisualization;
