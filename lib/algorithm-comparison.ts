export interface AlgorithmInfo {
  name: string;
  type: 'compression' | 'graph';
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  description: string;
  useCases: string[];
  pros: string[];
  cons: string[];
}

export interface BenchmarkResult {
  algorithm: string;
  dataSize: number;
  executionTime: number;
  iterations: number;
  avgTime: number;
}

export const algorithmDatabase: Record<string, AlgorithmInfo> = {
  huffman: {
    name: 'Huffman Coding',
    type: 'compression',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(n)',
    description: 'Greedy algorithm building optimal prefix-free codes from leaf nodes upward',
    useCases: [
      'Image compression (JPEG)',
      'Audio compression',
      'Text compression',
      'Lossless data compression',
    ],
    pros: [
      'Optimal for prefix-free codes',
      'Linear time decoding',
      'Proven efficiency',
      'Simple to implement',
    ],
    cons: [
      'Not optimal for small alphabets',
      'Requires frequency analysis',
      'Tree must be stored with data',
    ],
  },
  fano: {
    name: 'Fano Algorithm',
    type: 'compression',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(n)',
    description: 'Recursive probability-based splitting creating variable-length codes',
    useCases: [
      'Text compression',
      'General data compression',
      'Educational purposes',
    ],
    pros: [
      'Top-down approach (intuitive)',
      'Good compression ratio',
      'Faster practical performance',
    ],
    cons: [
      'Generally suboptimal vs Huffman',
      'Split point selection critical',
      'Requires sorted input',
    ],
  },
  shannonFanoElias: {
    name: 'Shannon-Fano-Elias',
    type: 'compression',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(n)',
    description: 'Arithmetic coding variant using cumulative probability distribution',
    useCases: [
      'Source coding',
      'Information theory applications',
      'Entropy encoding',
      'Foundation for arithmetic coding',
    ],
    pros: [
      'Theoretically sound',
      'Approaches entropy limit',
      'Foundation for advanced methods',
      'Guaranteed efficiency',
    ],
    cons: [
      'More complex to implement',
      'Slower than Huffman',
      'Requires floating-point arithmetic',
    ],
  },
  lempelZiv: {
    name: 'Lempel-Ziv',
    type: 'compression',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(d)',
    description: 'Dictionary-based compression replacing repeated patterns with codes',
    useCases: [
      'GIF/TIFF compression',
      'ZIP archives (DEFLATE)',
      'Modem transmission',
      'Repetitive data',
    ],
    pros: [
      'Works on any data',
      'No frequency analysis needed',
      'Adaptive dictionary',
      'Used in standards (gzip)',
    ],
    cons: [
      'Not optimal for low-repetition data',
      'Dictionary overhead',
      'Slower on non-repetitive data',
    ],
  },
  hamilton: {
    name: 'Hamilton Cycle Detection',
    type: 'graph',
    timeComplexity: {
      best: 'O(n!)',
      average: 'O(n!)',
      worst: 'O(n!)',
    },
    spaceComplexity: 'O(n)',
    description: 'Backtracking algorithm finding paths visiting each vertex exactly once',
    useCases: [
      'Traveling Salesman Problem',
      'Route optimization',
      'Circuit design',
      'Network planning',
    ],
    pros: [
      'Finds all cycles',
      'Exact solution',
      'Backtracking framework',
      'Handles any graph',
    ],
    cons: [
      'NP-complete problem',
      'Exponential time complexity',
      'Impractical for large graphs',
      'No known polynomial solution',
    ],
  },
};

// Benchmark compression algorithm
export function benchmarkCompressionAlgorithm(
  algorithm: 'huffman' | 'fano' | 'shannonFanoElias' | 'lempelZiv',
  dataSize: number,
  iterations: number = 5
): BenchmarkResult {
  // Generate test data
  const testData = generateTestData(dataSize);

  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();

    switch (algorithm) {
      case 'huffman':
        benchmarkHuffman(testData);
        break;
      case 'fano':
        benchmarkFano(testData);
        break;
      case 'shannonFanoElias':
        benchmarkShannonFanoElias(testData);
        break;
      case 'lempelZiv':
        benchmarkLZ(testData);
        break;
    }

    const end = performance.now();
    times.push(end - start);
  }

  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const totalTime = times.reduce((a, b) => a + b, 0);

  return {
    algorithm,
    dataSize,
    executionTime: totalTime,
    iterations,
    avgTime,
  };
}

function generateTestData(size: number): Array<{ char: string; prob: number }> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const data: { char: string; prob: number }[] = [];

  for (let i = 0; i < size; i++) {
    const char = chars[Math.floor(Math.random() * chars.length)];
    const existing = data.find((d) => d.char === char);
    if (existing) {
      existing.prob += 1 / size;
    } else {
      data.push({ char, prob: 1 / size });
    }
  }

  return data;
}

function benchmarkHuffman(data: Array<{ char: string; prob: number }>) {
  // Simulate Huffman encoding
  const sorted = [...data].sort((a, b) => b.prob - a.prob);
  // Build tree
  let nodes = sorted.map((s, i) => ({ char: s.char, freq: s.prob, id: i }));

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    nodes.push({
      char: '',
      freq: left.freq + right.freq,
      id: Date.now() + Math.random(),
    });
  }
}

function benchmarkFano(data: Array<{ char: string; prob: number }>) {
  // Simulate Fano encoding
  const sorted = [...data].sort((a, b) => b.prob - a.prob);

  function fano(syms: typeof sorted): void {
    if (syms.length <= 1) return;

    let sum = syms.reduce((a, s) => a + s.prob, 0);
    let currSum = 0;
    let split = 0;

    for (let i = 0; i < syms.length; i++) {
      currSum += syms[i].prob;
      if (currSum >= sum / 2) {
        split = i + 1;
        break;
      }
    }

    fano(syms.slice(0, split));
    fano(syms.slice(split));
  }

  fano(sorted);
}

function benchmarkShannonFanoElias(data: Array<{ char: string; prob: number }>) {
  // Simulate Shannon-Fano-Elias encoding
  const sorted = [...data].sort((a, b) => b.prob - a.prob);
  let cumulativeProb = 0;

  sorted.forEach((symbol) => {
    const F = cumulativeProb + symbol.prob / 2;
    const codeLength = Math.ceil(-Math.log2(symbol.prob));
    Math.floor(F * Math.pow(2, codeLength))
      .toString(2)
      .padStart(codeLength, '0');
    cumulativeProb += symbol.prob;
  });
}

function benchmarkLZ(data: Array<{ char: string; prob: number }>) {
  // Simulate LZ compression with simplified logic
  const text = data.flatMap((d) => d.char.repeat(Math.ceil(d.prob * 100))).join('');
  const windowSize = 4096;

  for (let pos = 0; pos < text.length; pos += 18) {
    const window = text.substring(Math.max(0, pos - windowSize), pos);
    const lookAhead = text.substring(pos, pos + 18);

    for (let i = 0; i < window.length; i++) {
      let matchLength = 0;
      while (
        matchLength < lookAhead.length &&
        window[i + matchLength] === lookAhead[matchLength]
      ) {
        matchLength++;
      }
    }
  }
}

// Get algorithm metadata
export function getAlgorithmInfo(
  algorithm:
    | 'huffman'
    | 'fano'
    | 'shannonFanoElias'
    | 'lempelZiv'
    | 'hamilton'
): AlgorithmInfo {
  return algorithmDatabase[algorithm];
}
