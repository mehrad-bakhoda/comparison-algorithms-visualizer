'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Language, getTranslation } from '@/lib/i18n';

type Algorithm = 'huffman' | 'fano' | 'shannonFanoElias' | 'lempelZiv' | 'hamilton' | 'hamming';

interface AlgorithmSelectorProps {
  selectedAlgorithm: Algorithm;
  onSelectAlgorithm: (algo: Algorithm) => void;
  language: Language;
}

const algorithms: { id: Algorithm; type: 'compression' | 'errorCorrection' | 'graph' }[] = [
  { id: 'huffman', type: 'compression' },
  { id: 'fano', type: 'compression' },
  { id: 'shannonFanoElias', type: 'compression' },
  { id: 'lempelZiv', type: 'compression' },
  { id: 'hamming', type: 'errorCorrection' },
  { id: 'hamilton', type: 'graph' },
];

export default function AlgorithmSelector({
  selectedAlgorithm,
  onSelectAlgorithm,
  language,
}: AlgorithmSelectorProps) {
  const t = getTranslation(language);

  const compressionAlgos = algorithms.filter((a) => a.type === 'compression');
  const errorCorrectionAlgos = algorithms.filter((a) => a.type === 'errorCorrection');
  const graphAlgos = algorithms.filter((a) => a.type === 'graph');

  const getAlgorithmName = (id: Algorithm) => {
    const names: Record<Algorithm, string> = {
      huffman: t.algorithms.huffman,
      fano: t.algorithms.fano,
      shannonFanoElias: t.algorithms.shannonFanoElias,
      lempelZiv: t.algorithms.lempelZiv,
      hamming: 'Hamming Code',
      hamilton: t.algorithms.hamilton,
    };
    return names[id];
  };

  return (
    <div className="space-y-6">
      {/* Compression Algorithms */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-primary">{t.algorithmTypes.compression}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {compressionAlgos.map((algo) => (
            <Button
              key={algo.id}
              variant={selectedAlgorithm === algo.id ? 'default' : 'outline'}
              className="h-auto py-4 flex flex-col items-center justify-center text-center"
              onClick={() => onSelectAlgorithm(algo.id)}
            >
              <span className="text-sm font-medium">{getAlgorithmName(algo.id)}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Error Correction Algorithms */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-primary">Error Correction</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {errorCorrectionAlgos.map((algo) => (
            <Button
              key={algo.id}
              variant={selectedAlgorithm === algo.id ? 'default' : 'outline'}
              className="h-auto py-4 flex flex-col items-center justify-center text-center"
              onClick={() => onSelectAlgorithm(algo.id)}
            >
              <span className="text-sm font-medium">{getAlgorithmName(algo.id)}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Graph Algorithms */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-primary">{t.algorithmTypes.graph}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {graphAlgos.map((algo) => (
            <Button
              key={algo.id}
              variant={selectedAlgorithm === algo.id ? 'default' : 'outline'}
              className="h-auto py-4 flex flex-col items-center justify-center text-center"
              onClick={() => onSelectAlgorithm(algo.id)}
            >
              <span className="text-sm font-medium">{getAlgorithmName(algo.id)}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
