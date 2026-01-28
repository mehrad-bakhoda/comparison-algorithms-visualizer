'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Language, getTranslation } from '@/lib/i18n';
import AlgorithmSelector from '@/components/algorithm-selector';
import LanguageSwitcher from '@/components/language-switcher';
import HuffmanVisualizer from '@/components/huffman-visualizer';
import FanoVisualizer from '@/components/fano-visualizer';
import ShannonFanoEliasVisualizer from '@/components/shannon-fano-elias-visualizer';
import LempelZivVisualizer from '@/components/lempel-ziv-visualizer';
import HamiltonVisualizer from '@/components/hamilton-visualizer';
import HammingCodeVisualizer from '@/components/hamming-code-visualizer';

type Algorithm = 'huffman' | 'fano' | 'shannonFanoElias' | 'lempelZiv' | 'hamilton' | 'hamming';

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('huffman');
  const t = getTranslation(language);
  const isRTL = language === 'fa';

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
<header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
  <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    
    {/* Left: Title */}
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-primary">
        {t.header.title}
      </h1>
      <p className="text-sm text-muted-foreground">
        {t.header.subtitle}
      </p>
    </div>

    {/* Right: Buttons */}
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
      <Link href="/docs" className="w-full sm:w-auto">
        <Button variant="outline" size="sm" className="w-full">
          {t.documentation.title}
        </Button>
      </Link>

      <Link href="/compare" className="w-full sm:w-auto">
        <Button variant="outline" size="sm" className="w-full">
          {t.compare.title}
        </Button>
      </Link>
    </div>
  </div>
</header>


      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Algorithm Selector */}
        <AlgorithmSelector 
          selectedAlgorithm={selectedAlgorithm}
          onSelectAlgorithm={setSelectedAlgorithm}
          language={language}
        />

        {/* Algorithm Visualizer */}
        <div className="mt-8">
          {selectedAlgorithm === 'huffman' && (
            <HuffmanVisualizer language={language} />
          )}
          {selectedAlgorithm === 'fano' && (
            <FanoVisualizer language={language} />
          )}
          {selectedAlgorithm === 'shannonFanoElias' && (
            <ShannonFanoEliasVisualizer language={language} />
          )}
          {selectedAlgorithm === 'lempelZiv' && (
            <LempelZivVisualizer language={language} />
          )}
          {selectedAlgorithm === 'hamilton' && (
            <HamiltonVisualizer language={language} />
          )}
          {selectedAlgorithm === 'hamming' && (
            <HammingCodeVisualizer language={language} />
          )}
        </div>
      </main>
    </div>
  );
}
