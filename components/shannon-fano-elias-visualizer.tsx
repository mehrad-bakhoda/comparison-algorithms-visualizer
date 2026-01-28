'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import { Language, getTranslation } from '@/lib/i18n';

interface Symbol {
  char: string;
  prob: number;
}

interface SFEStep {
  message: string;
  action: string;
  codes: Map<string, string>;
  current: { char: string; prob: number; cumulativeStart: number; cumulativeMid: number };
}

interface SFEVisualizerProps {
  language: Language;
}

export default function ShannonFanoEliasVisualizer({ language }: SFEVisualizerProps) {
  const t = getTranslation(language);
  const [symbols, setSymbols] = useState<Symbol[]>([
    { char: 'A', prob: 0.4 },
    { char: 'B', prob: 0.3 },
    { char: 'C', prob: 0.2 },
    { char: 'D', prob: 0.1 },
  ]);

  const [newChar, setNewChar] = useState('');
  const [newProb, setNewProb] = useState('');
  const [steps, setSteps] = useState<SFEStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [finalCodes, setFinalCodes] = useState<Array<{ char: string; prob: number; code: string }>>([]);

  const sfeAlgorithm = (items: Symbol[]): { steps: SFEStep[]; codes: Map<string, string> } => {
    const sorted = [...items].sort((a, b) => b.prob - a.prob);
    const newSteps: SFEStep[] = [];
    const codeMap = new Map<string, string>();

    let cumulative = 0;

    sorted.forEach(symbol => {
      const cumulativeStart = cumulative;
      const cumulativeMid = cumulative + symbol.prob / 2;
      cumulative += symbol.prob;

      const binaryMid = cumulativeMid.toString(2).substring(2, 10);
      const codeLength = Math.ceil(-Math.log2(symbol.prob));
      const code = binaryMid.substring(0, codeLength);

      codeMap.set(symbol.char, code);

      newSteps.push({
        message: `${symbol.char}: P=${symbol.prob.toFixed(2)}, Range=[${cumulativeStart.toFixed(2)}, ${cumulative.toFixed(2)}], Mid=${cumulativeMid.toFixed(4)}, Code=${code}`,
        action: 'encode',
        codes: new Map(codeMap),
        current: { char: symbol.char, prob: symbol.prob, cumulativeStart, cumulativeMid },
      });
    });

    return { steps: newSteps, codes: codeMap };
  };

  const generateCodes = () => {
    const { steps: newSteps, codes } = sfeAlgorithm(symbols);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);

    const codes_array = Array.from(codes).map(([char, code]) => {
      const sym = symbols.find(s => s.char === char);
      return { char, code, prob: sym?.prob || 0 };
    });
    setFinalCodes(codes_array);
  };

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsPlaying(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length]);

  const handleAddSymbol = () => {
    if (newChar && newProb) {
      const prob = parseFloat(newProb);
      if (prob > 0 && prob <= 1) {
        setSymbols([...symbols, { char: newChar, prob }]);
        setNewChar('');
        setNewProb('');
        setSteps([]);
      }
    }
  };

  const handleRemoveSymbol = (index: number) => {
    setSymbols(symbols.filter((_, i) => i !== index));
    setSteps([]);
  };

  const avgBits = finalCodes.reduce((sum, item) => sum + item.prob * item.code.length, 0);

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 p-6 bg-card/50 backdrop-blur border-border/50 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-primary">
            {t.shannonFanoElias?.title || 'Shannon-Fano-Elias'}
          </h3>

          <div className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
                {t.button.symbol || 'Symbol'}
              </Label>
              <Input
                value={newChar}
                onChange={e => setNewChar(e.target.value.toUpperCase())}
                placeholder="A"
                maxLength={1}
                className="text-center font-bold"
              />
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
                {t.button.probability || 'Probability'}
              </Label>
              <Input
                type="number"
                value={newProb}
                onChange={e => setNewProb(e.target.value)}
                placeholder="0.4"
                min="0"
                max="1"
                step="0.1"
                className="text-center"
              />
            </div>

            <Button onClick={handleAddSymbol} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              {t.button.add || 'Add'}
            </Button>
          </div>

          <div className="mt-6 space-y-2 max-h-64 overflow-y-auto">
            {symbols.map((sym, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/30 group hover:bg-secondary/50 transition">
                <span className="font-mono font-bold text-accent">{sym.char}</span>
                <span className="text-xs text-muted-foreground">{(sym.prob * 100).toFixed(0)}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSymbol(idx)}
                  className="opacity-0 group-hover:opacity-100 transition text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            onClick={generateCodes}
            className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            disabled={symbols.length < 2}
          >
            {t.button.generate || 'Generate'}
          </Button>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {steps.length > 0 && (
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {t.shannonFanoElias?.encoding || 'Cumulative Probability Encoding'}
                </h3>
                <span className="text-sm text-muted-foreground font-mono">
                  {t.huffman.step || 'Step'} {currentStep + 1} / {steps.length}
                </span>
              </div>

              <div className="bg-secondary/30 border border-border/30 rounded-lg p-6 mb-6 min-h-24 flex items-center">
                <p className="text-sm text-foreground font-mono">{steps[currentStep]?.message}</p>
              </div>

              {currentStep < steps.length && (
                <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Symbol</p>
                      <p className="font-bold text-foreground">{steps[currentStep].current.char}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Probability</p>
                      <p className="font-bold text-foreground">{steps[currentStep].current.prob.toFixed(3)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Cumulative Start</p>
                      <p className="font-bold text-foreground">{steps[currentStep].current.cumulativeStart.toFixed(3)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Mid Point</p>
                      <p className="font-bold text-foreground">{steps[currentStep].current.cumulativeMid.toFixed(4)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      {t.button.pause || 'Pause'}
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      {steps.length === 0 ? t.button.play || 'Play' : 'Resume'}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  disabled={currentStep === steps.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentStep(0);
                    setIsPlaying(false);
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}

          {finalCodes.length > 0 && (
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-primary">{t.huffman.codes || 'Shannon-Fano-Elias Codes'}</h3>

              <div className="space-y-3">
                {finalCodes.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/30 hover:bg-secondary/50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center font-bold text-accent">{item.char}</div>
                      <div>
                        <p className="font-mono text-sm font-bold text-foreground">{item.code}</p>
                        <p className="text-xs text-muted-foreground">{(item.prob * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{item.code.length} bits</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{t.huffman.avgBits || 'Avg Bits/Symbol'}:</span> {avgBits.toFixed(3)}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
