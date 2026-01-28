'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Language, getTranslation } from '@/lib/i18n';
import LanguageSwitcher from '@/components/language-switcher';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DocsPage() {
  const [language, setLanguage] = useState<Language>('en');
  const t = getTranslation(language);
  const isRTL = language === 'fa';

  return (
    <div className={`min-h-screen bg-background text-foreground ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
  <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">{t.documentation.title}</h1>
            <p className="text-sm text-muted-foreground">
              Complete algorithm explanations and examples
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="sm">{t.nav.algorithms}</Button>
            </Link>
            <Link href="/compare">
              <Button variant="outline" size="sm">{t.compare.title}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="huffman" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="huffman">Huffman</TabsTrigger>
            <TabsTrigger value="fano">Fano</TabsTrigger>
            <TabsTrigger value="sfe">SFE</TabsTrigger>
            <TabsTrigger value="lz">LZ</TabsTrigger>
            <TabsTrigger value="hamilton">Hamilton</TabsTrigger>
          </TabsList>

          {/* Huffman */}
          <TabsContent value="huffman" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">{t.huffman.title}</h2>
              
              <div className="prose prose-invert max-w-none space-y-4">
                <section>
                  <h3 className="text-xl font-bold mb-2">Overview</h3>
                  <p className="text-foreground/80">
                    {language === 'en'
                      ? 'Huffman coding is a lossless data compression technique that assigns variable-length binary codes to symbols based on their frequency of occurrence. Symbols that appear more frequently receive shorter codes, while less frequent symbols receive longer codes. This ensures optimal compression for prefix-free codes.'
                      : 'کدگذاری هافمن یک تکنیک فشرده سازی داده های بدون تلفات است که کدهای باینری متغیر الطول را بر اساس فرکانس نویسه ها اختصاص می دهد. نویسه های با فرکانس بیشتر کدهای کوتاه تر دریافت می کنند در حالی که نویسه های کمتر فرکانس کدهای طولانی تر دریافت می کنند.'}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-2">Algorithm Steps</h3>
                  <ol className="list-decimal list-inside space-y-2 text-foreground/80">
                    <li>Count frequency of each symbol in the input</li>
                    <li>Create leaf nodes for each symbol with its frequency</li>
                    <li>Repeatedly combine two nodes with lowest frequency into a parent node</li>
                    <li>Continue until only one node (root) remains</li>
                    <li>Assign binary codes: left=0, right=1</li>
                    <li>Encode the message using the generated codes</li>
                  </ol>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-2">Complexity Analysis</h3>
                  <div className="grid grid-cols-2 gap-4 bg-secondary/10 p-4 rounded">
                    <div>
                      <p className="text-sm text-muted-foreground">Time Complexity</p>
                      <p className="font-mono font-bold">O(n log n)</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Space Complexity</p>
                      <p className="font-mono font-bold">O(n)</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-2">Example</h3>
                  <div className="bg-secondary/10 p-4 rounded font-mono text-sm space-y-2">
                    <p>Input: {'AAABBC'}</p>
                    <p>Frequencies: A=3, B=2, C=1</p>
                    <p>Huffman Codes: A='0', B='10', C='11'</p>
                    <p>Encoded: 000101011</p>
                    <p>Compression: 6 chars (48 bits) → 9 bits (75% reduction)</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-2">Applications</h3>
                  <ul className="list-disc list-inside space-y-1 text-foreground/80">
                    <li>JPEG image compression</li>
                    <li>MP3 audio compression</li>
                    <li>ZIP archive compression</li>
                    <li>PDF file optimization</li>
                  </ul>
                </section>
              </div>
            </Card>
          </TabsContent>

          {/* Fano */}
          <TabsContent value="fano" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">{t.fano.title}</h2>
              
              <div className="prose prose-invert max-w-none space-y-4">
                <section>
                  <h3 className="text-xl font-bold mb-2">Overview</h3>
                  <p className="text-foreground/80">
                    {language === 'en'
                      ? 'The Fano algorithm creates variable-length binary codes by recursively dividing a sorted set of symbols into two groups with approximately equal cumulative probability. It uses a top-down approach, assigning prefix bits 0 and 1 to each division.'
                      : 'الگوریتم فانو کدهای باینری متغیر الطول را با تقسیم بندی بازگشتی مجموعه ای از نویسه های مرتب شده به دو گروه با احتمال تجمعی تقریباً برابر ایجاد می کند.'}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-2">Algorithm Steps</h3>
                  <ol className="list-decimal list-inside space-y-2 text-foreground/80">
                    <li>Sort symbols by probability (highest to lowest)</li>
                    <li>Divide symbols into two groups with equal cumulative probability</li>
                    <li>Assign 0 to left group, 1 to right group</li>
                    <li>Recursively apply to each group until single symbol</li>
                    <li>Concatenate assigned bits for each symbol</li>
                  </ol>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-2">Complexity Analysis</h3>
                  <div className="grid grid-cols-2 gap-4 bg-secondary/10 p-4 rounded">
                    <div>
                      <p className="text-sm text-muted-foreground">Time Complexity</p>
                      <p className="font-mono font-bold">O(n log n)</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Space Complexity</p>
                      <p className="font-mono font-bold">O(n)</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-2">Comparison with Huffman</h3>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    <li>✓ Fano: Top-down, easier to understand conceptually</li>
                    <li>✗ Fano: Generally produces less optimal codes than Huffman</li>
                    <li>✓ Fano: Faster computation in practice</li>
                    <li>✗ Huffman: Bottom-up, more complex logic</li>
                    <li>✓ Huffman: Always produces optimal prefix-free codes</li>
                  </ul>
                </section>
              </div>
            </Card>
          </TabsContent>

          {/* Shannon-Fano-Elias */}
          <TabsContent value="sfe" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">{t.shannonFanoElias.title}</h2>
              
              <div className="prose prose-invert max-w-none space-y-4">
                <section>
                  <h3 className="text-xl font-bold mb-2">Overview</h3>
                  <p className="text-foreground/80">
                    {language === 'en'
                      ? 'Shannon-Fano-Elias coding is an entropy encoding method that uses cumulative probability distributions to assign binary codes. It bridges classical Shannon-Fano and modern arithmetic coding, guaranteeing code lengths within 1 bit of the theoretical optimum.'
                      : 'کدگذاری شانون-فانو-الیاس روشی برای رمزگذاری آنتروپی است که از توزیع احتمال تجمعی استفاده می کند.'}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-2">Mathematical Foundation</h3>
                  <div className="bg-secondary/10 p-4 rounded space-y-3">
                    <p>For each symbol i:</p>
                    <div className="font-mono text-sm space-y-1">
                      <p>F = cumulative probability up to symbol i</p>
                      <p>Z = F + P(i)/2</p>
                      <p>L = ⌈-log₂(P(i))⌉</p>
                      <p>Code = binary representation of Z with L bits</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-2">Properties</h3>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    <li>• Prefix-free: no code is prefix of another</li>
                    <li>• Guaranteed: code length ≤ ⌈log₂(1/P(i))⌉ + 1</li>
                    <li>• Average code length approaches entropy</li>
                    <li>• Theoretical foundation for arithmetic coding</li>
                  </ul>
                </section>
              </div>
            </Card>
          </TabsContent>

          {/* Lempel-Ziv */}
          <TabsContent value="lz" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">{t.lempelZiv.title}</h2>
              
              <div className="prose prose-invert max-w-none space-y-4">
                <section>
                  <h3 className="text-xl font-bold mb-2">Overview</h3>
                  <p className="text-foreground/80">
                    {language === 'en'
                      ? 'Lempel-Ziv is a dictionary-based compression algorithm that builds a codebook of recurring patterns dynamically. Unlike statistical methods, it works without prior frequency analysis and adapts to any input data, making it ideal for files with unknown characteristics.'
                      : 'لمپل-زیو الگوریتم فشرده سازی مبتنی بر فرهنگ لغت است که کتاب کد از الگوهای تکراری را به طور پویا می سازد.'}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-2">Variants</h3>
                  <div className="space-y-4">
                    <div className="bg-secondary/10 p-4 rounded">
                      <h4 className="font-bold mb-2">LZ77 (Sliding Window)</h4>
                      <p className="text-sm text-foreground/80 mb-2">
                        Searches previous data for matching patterns, encodes as (offset, length, next_char)
                      </p>
                      <p className="text-xs text-muted-foreground">Used in: ZIP, GZIP, PNG</p>
                    </div>

                    <div className="bg-secondary/10 p-4 rounded">
                      <h4 className="font-bold mb-2">LZ78 (Explicit Dictionary)</h4>
                      <p className="text-sm text-foreground/80 mb-2">
                        Builds explicit dictionary of patterns, encodes as (dictionary_index, new_char)
                      </p>
                      <p className="text-xs text-muted-foreground">Used in: GIF, TIFF</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-2">Advantages</h3>
                  <ul className="space-y-1 text-sm text-foreground/80">
                    <li>✓ No frequency analysis required</li>
                    <li>✓ Adapts to input characteristics</li>
                    <li>✓ Excellent for repetitive data</li>
                    <li>✓ Industry standard (DEFLATE)</li>
                  </ul>
                </section>
              </div>
            </Card>
          </TabsContent>

          {/* Hamilton Cycle */}
          <TabsContent value="hamilton" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">{t.hamilton.title}</h2>
              
              <div className="prose prose-invert max-w-none space-y-4">
                <section>
                  <h3 className="text-xl font-bold mb-2">Definition</h3>
                  <p className="text-foreground/80">
                    {language === 'en'
                      ? 'A Hamilton cycle is a closed walk in a graph that visits each vertex exactly once and returns to the starting vertex. Finding Hamilton cycles is NP-complete, meaning no known polynomial-time algorithm exists for general graphs.'
                      : 'دور همیلتون یک مسیر بسته در نمودار است که هر راس را دقیقاً یک بار بازدید می کند و به راس شروع بازمی گردد.'}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-2">Backtracking Algorithm</h3>
                  <div className="bg-secondary/10 p-4 rounded space-y-3 text-sm text-foreground/80">
                    <p>1. Start from a vertex</p>
                    <p>2. Recursively visit unvisited neighbors</p>
                    <p>3. If all vertices visited and edge exists to start → found cycle</p>
                    <p>4. Backtrack if dead-end reached</p>
                    <p>5. Try all starting vertices</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-2">Complexity</h3>
                  <div className="grid grid-cols-2 gap-4 bg-secondary/10 p-4 rounded">
                    <div>
                      <p className="text-sm text-muted-foreground">Time Complexity</p>
                      <p className="font-mono font-bold">O(n!)</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Space Complexity</p>
                      <p className="font-mono font-bold">O(n)</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-2">Real-World Applications</h3>
                  <ul className="space-y-1 text-sm text-foreground/80">
                    <li>• Traveling Salesman Problem (TSP)</li>
                    <li>• Circuit board drilling optimization</li>
                    <li>• Robot path planning</li>
                    <li>• DNA sequencing</li>
                    <li>• Network routing optimization</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold mb-2">How to Test</h3>
                  <div className="bg-secondary/10 p-4 rounded text-sm space-y-2 text-foreground/80">
                    <p>1. Verify all vertices in graph are in path</p>
                    <p>2. Check each consecutive edge exists</p>
                    <p>3. Confirm path starts and ends at same vertex</p>
                    <p>4. Each vertex appears exactly once (except start/end)</p>
                    <p>5. Use the built-in validation tool in the visualizer</p>
                  </div>
                </section>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Comparison */}
        <Card className="p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Algorithm Summary</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-bold">Algorithm</th>
                  <th className="text-left p-3 font-bold">Type</th>
                  <th className="text-left p-3 font-bold">Time Complexity</th>
                  <th className="text-left p-3 font-bold">Best For</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-border/50">
                  <td className="p-3 font-bold text-primary">Huffman</td>
                  <td className="p-3">Compression</td>
                  <td className="p-3 font-mono">O(n log n)</td>
                  <td className="p-3">Optimal prefix-free codes</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-3 font-bold text-primary">Fano</td>
                  <td className="p-3">Compression</td>
                  <td className="p-3 font-mono">O(n log n)</td>
                  <td className="p-3">Quick approximate codes</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-3 font-bold text-primary">Shannon-Fano-Elias</td>
                  <td className="p-3">Compression</td>
                  <td className="p-3 font-mono">O(n log n)</td>
                  <td className="p-3">Entropy encoding foundation</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-3 font-bold text-primary">Lempel-Ziv</td>
                  <td className="p-3">Compression</td>
                  <td className="p-3 font-mono">O(n)</td>
                  <td className="p-3">Repetitive data</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-primary">Hamilton</td>
                  <td className="p-3">Graph</td>
                  <td className="p-3 font-mono">O(n!)</td>
                  <td className="p-3">Route optimization (exact)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
