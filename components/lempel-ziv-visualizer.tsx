'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import { Language, getTranslation } from '@/lib/i18n';

interface LZStep {
  position: number;
  offset: number;
  length: number;
  nextChar: string;
  message: string;
  dictionaryIndex: number; // Added dictionaryIndex to LZStep interface
}

interface LZVisualizerProps {
  language: Language;
}

export default function LempelZivVisualizer({ language }: LZVisualizerProps) {
  const t = getTranslation(language);
  const [inputText, setInputText] = useState('ABABCABABC');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState<LZStep[]>([]);
  const [dictionary, setDictionary] = useState<string[]>([]);

  const lzCompress = (text: string): { steps: LZStep[]; dictionary: string[] } => {
    const dict: string[] = [''];
    const newSteps: LZStep[] = [];
    let position = 0;

    while (position < text.length) {
      let length = 0;
      let offset = 0;

      for (let i = dict.length - 1; i >= 0; i--) {
        if (dict[i] === text.substring(position, position + dict[i].length + 1)) {
          offset = i;
          length = dict[i].length;
          break;
        }
      }

      const nextChar = text[position + length] || '';
      const newSeq = text.substring(position, position + length + 1);

      newSteps.push({
        position,
        offset,
        length,
        nextChar,
        message: `Found match at position ${position}: offset=${offset}, length=${length}, next='${nextChar}'`,
        dictionaryIndex: dict.length - 1, // Added dictionaryIndex to LZStep
      });

      if (newSeq && !dict.includes(newSeq)) {
        dict.push(newSeq);
      }

      position += length + 1;
    }

    return { steps: newSteps, dictionary: dict };
  };

  const handleRun = () => {
    const { steps: compSteps, dictionary: dict } = lzCompress(inputText);
    setSteps(compSteps);
    setDictionary(dict);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setSteps([]);
    setDictionary([]);
    setCurrentStep(0);
    setIsPlaying(false);
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

  const currentStepData = steps[currentStep];
  const compressionRatio = steps.length > 0 
    ? ((1 - (steps.length * 2) / inputText.length) * 100).toFixed(2)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <Card className="lg:col-span-1 p-6 bg-card/50 backdrop-blur border-border/50 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-primary">{t.lempelZiv?.originalText || 'Lempel-Ziv'}</h3>

          <div className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
                {t.lempelZiv?.originalText || 'Text to Compress'}
              </Label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value.toUpperCase())}
                placeholder="ABABCABABC"
                className="mt-2 font-mono text-sm"
                rows={6}
                disabled={steps.length > 0}
              />
            </div>

            <Button
              onClick={handleRun}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              disabled={inputText.length === 0}
            >
              <Play className="w-4 h-4 mr-2" />
              {t.button.generate || 'Generate'}
            </Button>

            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full bg-transparent"
              disabled={steps.length === 0}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t.button.reset || 'Reset'}
            </Button>
          </div>
        </Card>

        {/* Visualization Section */}
        <div className="lg:col-span-2 space-y-6">
          {steps.length > 0 && currentStepData && (
            <>
              <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">{t.lempelZiv?.pattern || 'Pattern Matching'}</h3>
                  <span className="text-sm text-muted-foreground font-mono">
                    {t.huffman.step || 'Step'} {currentStep + 1} / {steps.length}
                  </span>
                </div>

                <div className="bg-secondary/30 border border-border/30 rounded-lg p-6 mb-6 min-h-24 flex items-center font-mono text-sm overflow-x-auto">
                  <div className="whitespace-nowrap">
                    <span className="text-muted-foreground">
                      {inputText.substring(0, currentStepData.position)}
                    </span>
                    <span className="bg-accent/40 px-2 py-1 rounded font-bold text-foreground">
                      {inputText.substring(
                        currentStepData.position,
                        currentStepData.position + currentStepData.length
                      )}
                    </span>
                    <span className="bg-primary/40 px-2 py-1 rounded font-bold text-foreground">
                      {currentStepData.nextChar}
                    </span>
                    <span className="text-muted-foreground">
                      {inputText.substring(
                        currentStepData.position + currentStepData.length + 1
                      )}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Offset</p>
                    <p className="font-mono font-bold text-lg text-accent">{currentStepData.offset}</p>
                  </div>
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Length</p>
                    <p className="font-mono font-bold text-lg text-primary">{currentStepData.length}</p>
                  </div>
                  <div className="p-3 bg-muted/20 border border-border/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Next Char</p>
                    <p className="font-mono font-bold text-lg text-foreground">{currentStepData.nextChar}</p>
                  </div>
                </div>

                <div className="p-4 bg-secondary/30 border border-border/30 rounded-lg mb-6">
                  <p className="text-sm text-foreground">{currentStepData.message}</p>
                </div>

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
                        {t.button.play || 'Play'}
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

              {/* Stats */}
              <Card className="p-6 bg-accent/10 border-accent/30 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  {t.lempelZiv?.compressionRatio || 'Compression Statistics'}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Original</p>
                    <p className="text-3xl font-bold text-foreground">{inputText.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">characters</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Compressed</p>
                    <p className="text-3xl font-bold text-accent">{steps.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">codes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Reduction</p>
                    <p className="text-3xl font-bold text-primary">{compressionRatio}%</p>
                    <p className="text-xs text-muted-foreground mt-1">saved</p>
                  </div>
                </div>
              </Card>

              {/* Dictionary */}
              {dictionary.length > 0 && (
                <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4 text-primary">
                    {t.lempelZiv?.dictionary || 'Dictionary'}
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {dictionary.slice(0, 20).map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/30 hover:bg-secondary/50 transition font-mono text-sm"
                      >
                        <span className="font-bold text-accent">[{i}]</span>
                        <span className="text-foreground flex-1 ml-4">"{item}"</span>
                      </div>
                    ))}
                    {dictionary.length > 20 && (
                      <div className="text-xs text-muted-foreground p-3">
                        ... and {dictionary.length - 20} more entries
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
