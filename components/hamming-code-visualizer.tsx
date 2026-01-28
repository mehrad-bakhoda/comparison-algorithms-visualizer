'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import { Language, getTranslation } from '@/lib/i18n';

interface HammingStep {
  message: string;
  action: string;
  encoded?: string;
  parityBits?: Record<number, number>;
  position?: number;
}

interface HammingVisualizerProps {
  language: Language;
}

export default function HammingCodeVisualizer({ language }: HammingVisualizerProps) {
  const t = getTranslation(language);
  const [inputBits, setInputBits] = useState('1011');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [steps, setSteps] = useState<HammingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [encodedBits, setEncodedBits] = useState('');
  const [errorInfo, setErrorInfo] = useState<{ position: number; bit: string; fixed: string } | null>(null);

  // Hamming(7,4) Encoder: 4 data bits -> 7 code bits
  const hammingEncode = (dataBits: string): { encoded: string; steps: HammingStep[] } => {
    const newSteps: HammingStep[] = [];

    if (dataBits.length !== 4) {
      newSteps.push({
        message: 'Error: Input must be exactly 4 bits',
        action: 'error',
      });
      return { encoded: '', steps: newSteps };
    }

    const bits = dataBits.split('').map(Number);

    newSteps.push({
      message: `Input data bits: d1=${bits[0]}, d2=${bits[1]}, d3=${bits[2]}, d4=${bits[3]}`,
      action: 'input',
    });

    // Hamming(7,4) positions: 1,2,3,4,5,6,7 where 1,2,4 are parity bits
    const code = [0, 0, bits[0], 0, bits[1], bits[2], bits[3]]; // positions 3,5,6,7 are data

    newSteps.push({
      message: 'Assign data bits to positions (non-parity positions): p1=?, p2=?, d1=3, d2=5, d3=6, d4=7',
      action: 'assign',
      encoded: code.map((b, i) => (i === 0 ? '?' : i === 1 ? '?' : b)).join(''),
    });

    // Calculate parity bits
    // p1 covers positions 1,3,5,7
    const p1 = bits[0] ^ bits[2]; // d1 XOR d3
    code[0] = p1;

    newSteps.push({
      message: `P1 (covers positions 1,3,5,7): p1 = d1 ⊕ d3 = ${bits[0]} ⊕ ${bits[2]} = ${p1}`,
      action: 'parity',
      parityBits: { 1: p1 },
      encoded: code.map((b, i) => b).join(''),
    });

    // p2 covers positions 2,3,6,7
    const p2 = bits[0] ^ bits[1]; // d1 XOR d2
    code[1] = p2;

    newSteps.push({
      message: `P2 (covers positions 2,3,6,7): p2 = d1 ⊕ d2 = ${bits[0]} ⊕ ${bits[1]} = ${p2}`,
      action: 'parity',
      parityBits: { 2: p2 },
      encoded: code.map((b, i) => b).join(''),
    });

    // p4 covers positions 4,5,6,7
    const p4 = bits[1] ^ bits[2] ^ bits[3]; // d2 XOR d3 XOR d4
    code[3] = p4;

    newSteps.push({
      message: `P4 (covers positions 4,5,6,7): p4 = d2 ⊕ d3 ⊕ d4 = ${bits[1]} ⊕ ${bits[2]} ⊕ ${bits[3]} = ${p4}`,
      action: 'parity',
      parityBits: { 4: p4 },
      encoded: code.map((b, i) => b).join(''),
    });

    newSteps.push({
      message: `Encoded result: ${code.join('')} (7 bits with 3 parity bits)`,
      action: 'complete',
      encoded: code.join(''),
    });

    return { encoded: code.join(''), steps: newSteps };
  };

  // Hamming(7,4) Decoder: 7 code bits -> detect and correct errors
  const hammingDecode = (codeBits: string): { corrected: string; errorPos: number; steps: HammingStep[] } => {
    const newSteps: HammingStep[] = [];

    if (codeBits.length !== 7) {
      newSteps.push({
        message: 'Error: Input must be exactly 7 bits',
        action: 'error',
      });
      return { corrected: '', errorPos: 0, steps: newSteps };
    }

    const bits = codeBits.split('').map(Number);

    newSteps.push({
      message: `Received: ${codeBits}. Checking parity bits to detect errors...`,
      action: 'received',
    });

    // Check parity bits
    let errorPos = 0;

    // Check p1 (positions 1,3,5,7)
    const check1 = bits[0] ^ bits[2] ^ bits[4] ^ bits[6];
    newSteps.push({
      message: `P1 check (positions 1,3,5,7): ${bits[0]} ⊕ ${bits[2]} ⊕ ${bits[4]} ⊕ ${bits[6]} = ${check1} ${check1 === 0 ? '✓ OK' : '✗ ERROR'}`,
      action: 'check',
    });
    if (check1 === 1) errorPos += 1;

    // Check p2 (positions 2,3,6,7)
    const check2 = bits[1] ^ bits[2] ^ bits[5] ^ bits[6];
    newSteps.push({
      message: `P2 check (positions 2,3,6,7): ${bits[1]} ⊕ ${bits[2]} ⊕ ${bits[5]} ⊕ ${bits[6]} = ${check2} ${check2 === 0 ? '✓ OK' : '✗ ERROR'}`,
      action: 'check',
    });
    if (check2 === 1) errorPos += 2;

    // Check p4 (positions 4,5,6,7)
    const check4 = bits[3] ^ bits[4] ^ bits[5] ^ bits[6];
    newSteps.push({
      message: `P4 check (positions 4,5,6,7): ${bits[3]} ⊕ ${bits[4]} ⊕ ${bits[5]} ⊕ ${bits[6]} = ${check4} ${check4 === 0 ? '✓ OK' : '✗ ERROR'}`,
      action: 'check',
    });
    if (check4 === 1) errorPos += 4;

    const corrected = [...bits];

    if (errorPos === 0) {
      newSteps.push({
        message: 'No errors detected! Code is valid.',
        action: 'valid',
      });
    } else {
      newSteps.push({
        message: `Error detected at position ${errorPos}! Flipping bit at position ${errorPos}...`,
        action: 'error_found',
        position: errorPos,
      });

      corrected[errorPos - 1] = corrected[errorPos - 1] === 0 ? 1 : 0;

      newSteps.push({
        message: `Corrected code: ${corrected.join('')}. Extracted data bits from positions 3,5,6,7: ${corrected[2]}${corrected[4]}${corrected[5]}${corrected[6]}`,
        action: 'corrected',
        encoded: corrected.join(''),
      });
    }

    return { corrected: corrected.join(''), errorPos, steps: newSteps };
  };

  const handleEncode = () => {
    const { encoded: enc, steps: encSteps } = hammingEncode(inputBits);
    setSteps(encSteps);
    setEncodedBits(enc);
    setCurrentStep(0);
    setIsPlaying(false);
    setErrorInfo(null);
  };

  const handleDecode = () => {
    if (inputBits.length !== 7) {
      alert('For decoding, please enter exactly 7 bits (optionally with an error)');
      return;
    }
    const { corrected, errorPos, steps: decSteps } = hammingDecode(inputBits);
    setSteps(decSteps);
    setEncodedBits(corrected);
    setCurrentStep(0);
    setIsPlaying(false);
    if (errorPos > 0) {
      setErrorInfo({ position: errorPos, bit: inputBits[errorPos - 1], fixed: corrected[errorPos - 1] });
    } else {
      setErrorInfo(null);
    }
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

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 p-6 bg-card/50 backdrop-blur border-border/50 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-primary">Hamming(7,4) Code</h3>

          <div className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">Mode</Label>
              <div className="flex gap-2">
                <Button
                  variant={mode === 'encode' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setMode('encode');
                    setInputBits('1011');
                    setSteps([]);
                  }}
                  className="flex-1"
                >
                  Encode (4→7)
                </Button>
                <Button
                  variant={mode === 'decode' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setMode('decode');
                    setInputBits('1011010');
                    setSteps([]);
                  }}
                  className="flex-1"
                >
                  Decode (7→4)
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
                {mode === 'encode' ? '4-Bit Input' : '7-Bit Input (with optional error)'}
              </Label>
              <Input
                value={inputBits}
                onChange={e => setInputBits(e.target.value.replace(/[^01]/g, ''))}
                placeholder={mode === 'encode' ? '1011' : '1011010'}
                maxLength={mode === 'encode' ? 4 : 7}
                className="text-center font-mono font-bold tracking-widest"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {mode === 'encode'
                  ? `Enter 4 bits. Will encode to 7 bits with 3 parity bits.`
                  : `Enter 7 bits. Algorithm will detect and correct any single-bit error.`}
              </p>
            </div>

            <Button
              onClick={mode === 'encode' ? handleEncode : handleDecode}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              disabled={inputBits.length !== (mode === 'encode' ? 4 : 7)}
            >
              <Play className="w-4 h-4 mr-2" />
              {mode === 'encode' ? 'Encode' : 'Decode & Check'}
            </Button>

            {mode === 'decode' && (
              <div className="p-3 bg-secondary/30 border border-border/30 rounded-lg text-xs">
                <p className="font-semibold text-foreground mb-2">Test with error:</p>
                <div className="space-y-1">
                  <p>Original: <span className="font-mono font-bold">1011010</span></p>
                  <p>Flip bit 3: <span className="font-mono font-bold cursor-pointer text-accent hover:underline" onClick={() => setInputBits('1001010')}>1001010</span></p>
                  <p>Flip bit 5: <span className="font-mono font-bold cursor-pointer text-accent hover:underline" onClick={() => setInputBits('1011110')}>1011110</span></p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {steps.length > 0 && (
            <>
              <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {mode === 'encode' ? 'Encoding Process' : 'Error Detection & Correction'}
                  </h3>
                  <span className="text-sm text-muted-foreground font-mono">
                    Step {currentStep + 1} / {steps.length}
                  </span>
                </div>

                <div className="bg-secondary/30 border border-border/30 rounded-lg p-6 mb-6 min-h-24 flex items-center">
                  <p className="text-sm text-foreground">{steps[currentStep]?.message}</p>
                </div>

                {steps[currentStep]?.encoded && (
                  <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Current Code:</p>
                    <p className="font-mono text-xl font-bold text-accent tracking-widest">
                      {steps[currentStep].encoded}
                    </p>
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
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Play
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

              {errorInfo && (
                <Card className="p-6 bg-destructive/10 border-destructive/30 shadow-lg">
                  <h3 className="text-lg font-semibold text-destructive mb-4">Error Detected & Fixed!</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-2">Error Position</p>
                      <p className="text-3xl font-bold text-destructive">#{errorInfo.position}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-2">Wrong Bit</p>
                      <p className="text-3xl font-bold text-foreground">{errorInfo.bit}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-2">Corrected To</p>
                      <p className="text-3xl font-bold text-accent">{errorInfo.fixed}</p>
                    </div>
                  </div>
                </Card>
              )}

              {encodedBits && (
                <Card className="p-6 bg-primary/10 border-primary/30 shadow-lg">
                  <h3 className="text-lg font-semibold text-primary mb-4">
                    {mode === 'encode' ? 'Encoded Result' : 'Corrected Code'}
                  </h3>
                  <p className="font-mono text-2xl font-bold text-foreground tracking-widest mb-2">{encodedBits}</p>
                  {mode === 'encode' && <p className="text-sm text-muted-foreground">3 parity bits added for error correction</p>}
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
