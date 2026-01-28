'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import {
  benchmarkCompressionAlgorithm,
  getAlgorithmInfo,
  type BenchmarkResult,
} from '@/lib/algorithm-comparison';
import { Language, getTranslation } from '@/lib/i18n';

type Algorithm = 'huffman' | 'fano' | 'shannonFanoElias' | 'lempelZiv';

interface ComparisonDashboardProps {
  language: Language;
}

export default function ComparisonDashboard({ language }: ComparisonDashboardProps) {
  const t = getTranslation(language);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<Algorithm[]>([
    'huffman',
    'fano',
  ]);
  const [dataSize, setDataSize] = useState('1000');
  const [iterations, setIterations] = useState('3');
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const compressionAlgos: Algorithm[] = ['huffman', 'fano', 'shannonFanoElias', 'lempelZiv'];

  const handleToggleAlgorithm = (algo: Algorithm) => {
    setSelectedAlgorithms((prev) =>
      prev.includes(algo) ? prev.filter((a) => a !== algo) : [...prev, algo]
    );
  };

  const handleRunBenchmark = async () => {
    setIsRunning(true);
    const benchmarkResults: BenchmarkResult[] = [];

    for (const algo of selectedAlgorithms) {
      const result = benchmarkCompressionAlgorithm(algo, parseInt(dataSize), parseInt(iterations));
      benchmarkResults.push(result);
      // Small delay to allow UI update
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setResults(benchmarkResults);
    setIsRunning(false);
  };

  const maxTime = Math.max(...results.map((r) => r.avgTime), 1);
  const sortedResults = [...results].sort((a, b) => a.avgTime - b.avgTime);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-lg">
        <h3 className="text-lg font-semibold mb-6 text-primary">{t.compare.testSpeed}</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Algorithm Selection */}
          <div>
            <Label className="font-bold mb-3 block">
              {t.algorithmTypes.compression}
            </Label>
            <div className="space-y-2">
              {compressionAlgos.map((algo) => (
                <label key={algo} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAlgorithms.includes(algo)}
                    onChange={() => handleToggleAlgorithm(algo)}
                    className="rounded border border-border"
                  />
                  <span className="text-sm">{getAlgorithmInfo(algo).name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Test Parameters */}
          <div className="space-y-4">
            <div>
              <Label>{t.compare.dataSize}</Label>
              <Input
                type="number"
                value={dataSize}
                onChange={(e) => setDataSize(e.target.value)}
                min="100"
                max="10000"
                step="100"
                className="mt-2"
              />
            </div>

            <div>
              <Label>{t.compare.iterations}</Label>
              <Input
                type="number"
                value={iterations}
                onChange={(e) => setIterations(e.target.value)}
                min="1"
                max="10"
                className="mt-2"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col justify-end">
            <Button
              onClick={handleRunBenchmark}
              disabled={isRunning || selectedAlgorithms.length === 0}
              className="bg-primary text-primary-foreground"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : t.button.play}
            </Button>
          </div>
        </div>
      </Card>

      {/* Benchmark Results */}
      {results.length > 0 && (
        <>
          {/* Performance Bar Chart */}
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-lg">
            <h3 className="text-lg font-semibold mb-6 text-primary">Execution Time Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sortedResults}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey={(data) => getAlgorithmInfo(data.algorithm as Algorithm).name}
                  stroke="var(--color-muted-foreground)"
                />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-card)',
                    border: `1px solid var(--color-border)`,
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${(value as number).toFixed(4)} ms`, 'Time']}
                />
                <Bar dataKey="avgTime" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Performance Comparison Table */}
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-primary">Performance Metrics</h3>

            <div className="space-y-3">
              {sortedResults.map((result) => {
                const percent = (result.avgTime / maxTime) * 100;
                return (
                  <div key={result.algorithm}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">
                        {getAlgorithmInfo(result.algorithm as Algorithm).name}
                      </span>
                      <span className="text-sm font-mono font-bold text-accent">
                        {result.avgTime.toFixed(4)} ms
                      </span>
                    </div>
                    <div className="w-full bg-secondary/30 rounded-full h-3 overflow-hidden border border-border/30">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Detailed Results Table */}
          <Card className="p-6 overflow-x-auto bg-card/50 backdrop-blur border-border/50 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-primary">Detailed Results</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-border bg-secondary/30">
                    <th className="text-left p-3 font-bold text-foreground">Algorithm</th>
                    <th className="text-right p-3 font-bold text-foreground">{t.compare.dataSize}</th>
                    <th className="text-right p-3 font-bold text-foreground">{t.compare.iterations}</th>
                    <th className="text-right p-3 font-bold text-foreground">Total (ms)</th>
                    <th className="text-right p-3 font-bold text-accent">Avg (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((result, idx) => (
                    <tr key={result.algorithm} className="border-b border-border/30 hover:bg-secondary/20 transition">
                      <td className="p-3 font-medium text-foreground">
                        {getAlgorithmInfo(result.algorithm as Algorithm).name}
                      </td>
                      <td className="text-right p-3 font-mono text-muted-foreground">
                        {result.dataSize.toLocaleString()}
                      </td>
                      <td className="text-right p-3 font-mono text-muted-foreground">{result.iterations}</td>
                      <td className="text-right p-3 font-mono text-muted-foreground">
                        {result.executionTime.toFixed(4)}
                      </td>
                      <td className="text-right p-3 font-mono font-bold text-accent">
                        {result.avgTime.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Algorithm Comparison Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedAlgorithms.map((algo) => {
              const info = getAlgorithmInfo(algo);
              return (
                <Card key={algo} className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4 text-primary">{info.name}</h3>

                  <div className="space-y-4">
                    {/* Complexity */}
                    <div>
                      <h4 className="font-bold text-sm mb-2">
                        {t.compare.timeComplexity}
                      </h4>
                      <div className="space-y-1 text-sm font-mono">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {t.compare.bestCase}:
                          </span>
                          <span className="font-bold">{info.timeComplexity.best}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {t.compare.avgCase}:
                          </span>
                          <span className="font-bold">{info.timeComplexity.average}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {t.compare.worstCase}:
                          </span>
                          <span className="font-bold">{info.timeComplexity.worst}</span>
                        </div>
                      </div>
                    </div>

                    {/* Space Complexity */}
                    <div>
                      <h4 className="font-bold text-sm mb-2">
                        {t.compare.spaceComplexity}
                      </h4>
                      <p className="font-mono font-bold">{info.spaceComplexity}</p>
                    </div>

                    {/* Use Cases */}
                    <div>
                      <h4 className="font-bold text-sm mb-2">{t.compare.useCases}</h4>
                      <ul className="text-sm space-y-1">
                        {info.useCases.map((useCase, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pros */}
                    <div>
                      <h4 className="font-bold text-sm mb-2 text-green-600">
                        {t.compare.pros}
                      </h4>
                      <ul className="text-sm space-y-1">
                        {info.pros.map((pro, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-2">+</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cons */}
                    <div>
                      <h4 className="font-bold text-sm mb-2 text-red-600">
                        {t.compare.cons}
                      </h4>
                      <ul className="text-sm space-y-1">
                        {info.cons.map((con, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-2">−</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
