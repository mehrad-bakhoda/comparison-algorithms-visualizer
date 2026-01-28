'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Play, Pause, RotateCcw } from 'lucide-react';
import TreeVisualization from '@/components/tree-visualization';
import { Language, getTranslation } from '@/lib/i18n';

interface Symbol {
  char: string;
  probability: number;
}

interface HuffmanNode {
  char?: string;
  freq: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
  id: string;
}

interface HuffmanStep {
  tree: HuffmanNode;
  message: string;
  action: string;
}

interface CodeResult {
  char: string;
  code: string;
  probability: number;
}

interface HuffmanVisualizerProps {
  language: Language;
}

const HuffmanVisualizer: React.FC<HuffmanVisualizerProps> = ({ language }) => {
  const t = getTranslation(language);
  const [symbols, setSymbols] = useState<Symbol[]>([
    { char: 'A', probability: 0.3 },
    { char: 'B', probability: 0.1 },
    { char: 'C', probability: 0.1 },
    { char: 'D', probability: 0.5 },
  ]);

  const [newChar, setNewChar] = useState('');
  const [newProb, setNewProb] = useState('');
  const [steps, setSteps] = useState<HuffmanStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [codes, setCodes] = useState<CodeResult[]>([]);

  // Build Huffman tree and generate steps
  const buildHuffmanTree = useCallback(() => {
    if (symbols.length < 2) {
      alert('Please add at least 2 symbols');
      return;
    }

    const normalizedSymbols = symbols.map(s => ({
      ...s,
      probability: Math.max(0.01, s.probability),
    }));

    const totalProb = normalizedSymbols.reduce((sum, s) => sum + s.probability, 0);
    const normalized = normalizedSymbols.map(s => ({
      ...s,
      probability: s.probability / totalProb,
    }));

    const newSteps: HuffmanStep[] = [];
    let nodeId = 0;

    // Create leaf nodes
    const nodes: HuffmanNode[] = normalized.map(s => ({
      char: s.char,
      freq: s.probability,
      id: `node-${nodeId++}`,
    }));

    nodes.forEach((node, i) => {
      newSteps.push({
        tree: { ...node, id: `init-${i}` },
        message: `Created leaf node for '${node.char}' with probability ${node.freq.toFixed(3)}`,
        action: `initialize`,
      });
    });

    // Build tree
    while (nodes.length > 1) {
      nodes.sort((a, b) => a.freq - b.freq);

      const left = nodes.shift()!;
      const right = nodes.shift()!;

      const parent: HuffmanNode = {
        freq: left.freq + right.freq,
        left,
        right,
        id: `node-${nodeId++}`,
      };

      nodes.push(parent);

      newSteps.push({
        tree: JSON.parse(JSON.stringify(parent)),
        message: `Combined nodes with frequencies ${left.freq.toFixed(3)} and ${right.freq.toFixed(3)} = ${parent.freq.toFixed(3)}`,
        action: `combine`,
      });
    }

    const finalTree = nodes[0];
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);

    // Generate codes
    const generatedCodes: CodeResult[] = [];
    const generateCodes = (node: HuffmanNode | undefined, code: string = '') => {
      if (!node) return;
      if (node.char) {
        const originalSymbol = normalized.find(s => s.char === node.char);
        generatedCodes.push({
          char: node.char,
          code: code || '0',
          probability: originalSymbol?.probability || 0,
        });
      } else {
        generateCodes(node.left, code + '0');
        generateCodes(node.right, code + '1');
      }
    };

    generateCodes(finalTree);
    setCodes(generatedCodes.sort((a, b) => a.char.localeCompare(b.char)));
  }, [symbols]);

  const addSymbol = () => {
    if (!newChar || !newProb) {
      alert('Please fill in both fields');
      return;
    }

    const prob = parseFloat(newProb);
    if (isNaN(prob) || prob <= 0) {
      alert('Probability must be a positive number');
      return;
    }

    setSymbols([...symbols, { char: newChar.toUpperCase(), probability: prob }]);
    setNewChar('');
    setNewProb('');
  };

  const removeSymbol = (index: number) => {
    setSymbols(symbols.filter((_, i) => i !== index));
  };

  const resetVisualization = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setCodes([]);
  };

  const handlePlayPause = () => {
    if (steps.length === 0) {
      buildHuffmanTree();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  React.useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsPlaying(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps]);

  const currentStepData = steps[currentStep];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Huffman Coding Visualizer
          </h1>
          <p className="text-muted-foreground text-lg">
            Learn how data compression works step by step
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Input */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-border/50">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                Symbol Input
              </h2>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Character
                  </Label>
                  <Input
                    value={newChar}
                    onChange={e => setNewChar(e.target.value.toUpperCase())}
                    placeholder="e.g., A"
                    className="bg-input border-border"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Probability
                  </Label>
                  <Input
                    type="number"
                    value={newProb}
                    onChange={e => setNewProb(e.target.value)}
                    placeholder="e.g., 0.3"
                    step="0.01"
                    min="0"
                    className="bg-input border-border"
                  />
                </div>

                <Button
                  onClick={addSymbol}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Symbol
                </Button>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Current Symbols
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {symbols.map((sym, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-secondary/20 rounded-lg p-3 border border-border/30"
                    >
                      <span className="font-mono font-semibold text-foreground">
                        {sym.char}: {sym.probability.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeSymbol(i)}
                        className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/30 space-y-2">
                <Button
                  onClick={buildHuffmanTree}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                >
                  Build Tree
                </Button>
                <Button
                  onClick={resetVisualization}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </Card>
          </div>

          {/* Middle & Right: Visualization and Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tree Visualization */}
            {steps.length > 0 && (
              <Card className="p-6 border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    {t.huffman.title}
                  </h2>
                  <span className="text-sm text-muted-foreground font-mono">
                    {t.huffman.step} {currentStep + 1} / {steps.length}
                  </span>
                </div>

                <TreeVisualization tree={currentStepData?.tree} /> {/* Use TreeVisualization component */}

                <div className="mt-6 p-4 bg-secondary/20 rounded-lg border border-border/30">
                  <p className="text-sm text-foreground font-medium mb-2">
                    Action:
                  </p>
                  <p className="text-foreground/80">
                    {currentStepData?.message}
                  </p>
                </div>

                <div className="mt-6 flex gap-2">
                  <Button
                    onClick={handlePlayPause}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        {t.button.pause}
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        {steps.length === 0 ? t.button.play : 'Resume'}
                      </>
                    )}
                  </Button>

                  {currentStep > 0 && (
                    <Button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      variant="outline"
                    >
                      ← Prev
                    </Button>
                  )}

                  {currentStep < steps.length - 1 && (
                    <Button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      variant="outline"
                    >
                      Next →
                    </Button>
                  )}
                </div>
              </Card>
            )}

            {/* Huffman Codes Result */}
            {codes.length > 0 && (
              <Card className="p-6 border-border/50">
                <h2 className="text-xl font-semibold mb-4 text-foreground">
                  Generated Huffman Codes
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  {codes.map((code, i) => (
                    <div
                      key={i}
                      className="bg-accent/10 border border-accent/30 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-accent">
                          {code.char}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {(code.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                      <code className="text-sm font-mono text-foreground bg-background/50 px-2 py-1 rounded block text-center">
                        {code.code}
                      </code>
                    </div>
                  ))}
                </div>

                {codes.length > 0 && (
                  <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">
                      Compression Stats
                    </h3>
                    <p className="text-sm text-foreground/80 mb-2">
                      Average bits per symbol: {(codes.reduce((sum, c) => sum + c.code.length * c.probability, 0)).toFixed(3)}
                    </p>
                    <p className="text-sm text-foreground/80">
                      vs. Fixed encoding: {Math.ceil(Math.log2(codes.length))} bits
                    </p>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HuffmanVisualizer;
