'use client';

import React from "react"

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Play, RotateCcw } from 'lucide-react';
import {
  Node,
  Edge,
  findHamiltonCycles,
  validateHamiltonCycle,
  getGraphStats,
} from '@/lib/hamilton-algorithm';
import { Language, getTranslation } from '@/lib/i18n';

interface HamiltonVisualizerProps {
  language: Language;
}

export default function HamiltonVisualizer({ language }: HamiltonVisualizerProps) {
  const t = getTranslation(language);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'A', x: 100, y: 100, label: 'A' },
    { id: 'B', x: 250, y: 100, label: 'B' },
    { id: 'C', x: 250, y: 250, label: 'C' },
    { id: 'D', x: 100, y: 250, label: 'D' },
  ]);

  const [edges, setEdges] = useState<Edge[]>([
    { id: '1', from: 'A', to: 'B' },
    { id: '2', from: 'B', to: 'C' },
    { id: '3', from: 'C', to: 'D' },
    { id: '4', from: 'D', to: 'A' },
    { id: '5', from: 'A', to: 'C' },
    { id: '6', from: 'B', to: 'D' },
  ]);

  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [fromNode, setFromNode] = useState('');
  const [toNode, setToNode] = useState('');
  const [cycles, setCycles] = useState<Array<{ path: string[]; isValid: boolean }>>([]);
  const [selectedCycle, setSelectedCycle] = useState(0);
  const [testPath, setTestPath] = useState('');
  const [testResult, setTestResult] = useState<{
    isValid: boolean;
    message: string;
    issues: string[];
  } | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);

  const stats = getGraphStats(nodes, edges);

  const handleAddNode = () => {
    if (newNodeLabel.trim()) {
      const newNode: Node = {
        id: newNodeLabel.toUpperCase(),
        x: Math.random() * 300 + 50,
        y: Math.random() * 300 + 50,
        label: newNodeLabel.toUpperCase(),
      };
      if (!nodes.find((n) => n.id === newNode.id)) {
        setNodes([...nodes, newNode]);
        setNewNodeLabel('');
      }
    }
  };

  const handleAddEdge = () => {
    if (fromNode && toNode && fromNode !== toNode) {
      if (!edges.find((e) => e.from === fromNode && e.to === toNode)) {
        setEdges([
          ...edges,
          {
            id: `edge-${Date.now()}`,
            from: fromNode,
            to: toNode,
          },
        ]);
        setFromNode('');
        setToNode('');
      }
    }
  };

  const handleRemoveNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id));
    setEdges(edges.filter((e) => e.from !== id && e.to !== id));
  };

  const handleRemoveEdge = (id: string) => {
    setEdges(edges.filter((e) => e.id !== id));
  };

  const handleFindCycles = () => {
    const foundCycles = findHamiltonCycles(nodes, edges, 5);
    setCycles(foundCycles);
    setSelectedCycle(0);
  };

  const handleTestCycle = () => {
    const path = testPath
      .split('->')
      .map((s) => s.trim().toUpperCase())
      .filter((s) => s);
    const result = validateHamiltonCycle(path, nodes, edges);
    setTestResult(result);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const node of nodes) {
      const dist = Math.hypot(node.x - x, node.y - y);
      if (dist < 25) {
        setDraggingNode(node.id);
        break;
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingNode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(25, Math.min(e.clientX - rect.left, canvas.width - 25));
    const y = Math.max(25, Math.min(e.clientY - rect.top, canvas.height - 25));

    setNodes(
      nodes.map((n) => (n.id === draggingNode ? { ...n, x, y } : n))
    );
  };

  const handleCanvasMouseUp = () => {
    setDraggingNode(null);
  };

  // Draw graph
  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from);
      const toNode = nodes.find((n) => n.id === edge.to);
      if (fromNode && toNode) {
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();

        // Arrow
        const angle = Math.atan2(
          toNode.y - fromNode.y,
          toNode.x - fromNode.x
        );
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.moveTo(toNode.x, toNode.y);
        ctx.lineTo(
          toNode.x - 15 * Math.cos(angle - Math.PI / 6),
          toNode.y - 15 * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          toNode.x - 15 * Math.cos(angle + Math.PI / 6),
          toNode.y - 15 * Math.sin(angle + Math.PI / 6)
        );
        ctx.fill();
      }
    });

    // Draw highlighted cycle if selected
    if (cycles[selectedCycle]) {
      const path = cycles[selectedCycle].path;
      for (let i = 0; i < path.length - 1; i++) {
        const fromNode = nodes.find((n) => n.id === path[i]);
        const toNode = nodes.find((n) => n.id === path[i + 1]);
        if (fromNode && toNode) {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach((node) => {
      ctx.fillStyle = '#9f7aea';
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
    });
  };

  // Draw on mount and update
  React.useEffect(() => {
    drawGraph();
  }, [nodes, edges, cycles, selectedCycle]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-4">
          {/* Add Node */}
          <Card className="p-4">
            <h3 className="font-bold mb-3 text-sm">{t.hamilton.addNode}</h3>
            <div className="space-y-2">
              <Input
                value={newNodeLabel}
                onChange={(e) => setNewNodeLabel(e.target.value)}
                placeholder="Node label"
                maxLength="1"
                className="text-center font-bold text-lg"
              />
              <Button onClick={handleAddNode} size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                {t.button.add}
              </Button>
            </div>
          </Card>

          {/* Add Edge */}
          <Card className="p-4">
            <h3 className="font-bold mb-3 text-sm">{t.hamilton.addEdge}</h3>
            <div className="space-y-2">
              <select
                value={fromNode}
                onChange={(e) => setFromNode(e.target.value)}
                className="w-full p-2 border border-border rounded text-sm bg-background"
              >
                <option value="">From</option>
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>

              <select
                value={toNode}
                onChange={(e) => setToNode(e.target.value)}
                className="w-full p-2 border border-border rounded text-sm bg-background"
              >
                <option value="">To</option>
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>

              <Button onClick={handleAddEdge} size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                {t.button.add}
              </Button>
            </div>
          </Card>

          {/* Nodes List */}
          <Card className="p-4">
            <h3 className="font-bold mb-3 text-sm">{t.hamilton.nodes}</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className="flex items-center justify-between p-2 bg-secondary/20 rounded text-sm"
                >
                  <span className="font-bold">{node.label}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveNode(node.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Edges List */}
          <Card className="p-4">
            <h3 className="font-bold mb-3 text-sm">{t.hamilton.edges}</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {edges.map((edge) => (
                <div
                  key={edge.id}
                  className="flex items-center justify-between p-2 bg-secondary/20 rounded text-sm font-mono"
                >
                  <span>
                    {edge.from} → {edge.to}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveEdge(edge.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Statistics */}
          <Card className="p-4 bg-accent/5">
            <h3 className="font-bold mb-3 text-sm">{t.hamilton.nodeCount}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.hamilton.nodes}:</span>
                <span className="font-bold">{stats.nodes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.hamilton.edges}:</span>
                <span className="font-bold">{stats.edges}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Density:</span>
                <span className="font-bold">{stats.density}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-4">
            <h3 className="font-bold mb-3">{t.hamilton.findCycle}</h3>
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full border border-border rounded-lg bg-background/50 cursor-move"
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Drag nodes to reposition. Yellow edges show selected cycle.
            </p>
          </Card>

          {/* Find Cycles */}
          <Button
            onClick={handleFindCycles}
            className="w-full bg-primary text-primary-foreground"
          >
            <Play className="w-4 h-4 mr-2" />
            {t.hamilton.findCycle}
          </Button>

          {/* Cycles Results */}
          {cycles.length > 0 && (
            <Card className="p-4">
              <h3 className="font-bold mb-3">
                Found {cycles.length} {cycles.length === 1 ? 'Cycle' : 'Cycles'}
              </h3>
              <div className="space-y-2">
                {cycles.map((cycle, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCycle(i)}
                    className={`w-full p-3 text-left rounded-lg font-mono text-sm transition ${
                      selectedCycle === i
                        ? 'bg-accent/20 border-2 border-accent'
                        : 'bg-secondary/20 border border-border hover:bg-secondary/30'
                    }`}
                  >
                    {cycle.path.join(' → ')}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Test Cycle */}
          <Card className="p-4">
            <h3 className="font-bold mb-3">{t.hamilton.testCycle}</h3>
            <div className="space-y-3">
              <Input
                value={testPath}
                onChange={(e) => setTestPath(e.target.value)}
                placeholder="e.g., A->B->C->D->A"
                className="font-mono text-sm"
              />
              <Button
                onClick={handleTestCycle}
                className="w-full bg-transparent"
                variant="outline"
              >
                {t.hamilton.testCycle}
              </Button>

              {testResult && (
                <div
                  className={`p-4 rounded-lg border-2 ${
                    testResult.isValid
                      ? 'bg-green-500/10 border-green-500'
                      : 'bg-red-500/10 border-red-500'
                  }`}
                >
                  <p
                    className={`font-bold ${
                      testResult.isValid ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {testResult.isValid
                      ? t.hamilton.validCycle
                      : t.hamilton.invalidCycle}
                  </p>
                  <p className="text-sm mt-2">{testResult.message}</p>
                  {testResult.issues.length > 0 && (
                    <ul className="mt-3 space-y-1 text-sm">
                      {testResult.issues.map((issue, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
