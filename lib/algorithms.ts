// Fano Algorithm
export interface FanoStep {
  symbols: Array<{ char: string; prob: number }>;
  code: string;
  depth: number;
  message: string;
}

export function fanoAlgorithm(symbols: Array<{ char: string; prob: number }>) {
  const sorted = [...symbols].sort((a, b) => b.prob - a.prob);
  const steps: FanoStep[] = [];
  const codes: Record<string, string> = {};

  function fanoHelper(
    syms: Array<{ char: string; prob: number }>,
    code: string,
    depth: number
  ) {
    if (syms.length === 0) return;
    if (syms.length === 1) {
      codes[syms[0].char] = code || '0';
      steps.push({
        symbols: syms,
        code,
        depth,
        message: `Assigned code '${code || '0'}' to symbol '${syms[0].char}'`,
      });
      return;
    }

    let sum = syms.reduce((acc, s) => acc + s.prob, 0);
    let currSum = 0;
    let split = 0;

    for (let i = 0; i < syms.length; i++) {
      currSum += syms[i].prob;
      if (currSum >= sum / 2) {
        split = i + 1;
        break;
      }
    }

    const left = syms.slice(0, split);
    const right = syms.slice(split);

    steps.push({
      symbols: syms,
      code,
      depth,
      message: `Split into groups: ${left.map((s) => s.char).join(',')} (prob: ${left.reduce((a, s) => a + s.prob, 0).toFixed(3)}) and ${right.map((s) => s.char).join(',')} (prob: ${right.reduce((a, s) => a + s.prob, 0).toFixed(3)})`,
    });

    fanoHelper(left, code + '0', depth + 1);
    fanoHelper(right, code + '1', depth + 1);
  }

  fanoHelper(sorted, '', 0);

  const results = sorted.map((s) => ({
    char: s.char,
    prob: s.prob,
    code: codes[s.char] || '',
  }));

  return { steps, codes, results };
}

// Shannon-Fano-Elias Algorithm
export interface SFEStep {
  char: string;
  prob: number;
  cumulativeProb: number;
  codeLength: number;
  code: string;
}

export function shannonFanoEliasAlgorithm(symbols: Array<{ char: string; prob: number }>) {
  const sorted = [...symbols].sort((a, b) => b.prob - a.prob);
  const steps: SFEStep[] = [];

  let cumulativeProb = 0;

  sorted.forEach((symbol) => {
    const prob = symbol.prob;
    const prevCumulative = cumulativeProb;
    cumulativeProb += prob;

    const F = prevCumulative + prob / 2;
    const codeLength = Math.ceil(-Math.log2(prob));
    const code = Math.floor(F * Math.pow(2, codeLength))
      .toString(2)
      .padStart(codeLength, '0');

    steps.push({
      char: symbol.char,
      prob,
      cumulativeProb,
      codeLength,
      code,
    });
  });

  return { steps, codes: steps };
}

// Lempel-Ziv Algorithm (LZ77 variant)
export interface LZStep {
  position: number;
  offset: number;
  length: number;
  nextChar: string;
  dictionaryIndex: number;
  message: string;
}

export function lempelZivCompress(text: string) {
  const steps: LZStep[] = [];
  const windowSize = 4096;
  const lookaheadSize = 18;
  let position = 0;
  const dictionary: string[] = [];

  while (position < text.length) {
    let bestMatch = { offset: 0, length: 0 };
    const lookAhead = text.substring(position, position + lookaheadSize);

    // Search for matches in the window
    const windowStart = Math.max(0, position - windowSize);
    const windowText = text.substring(windowStart, position);

    for (let i = 0; i < windowText.length; i++) {
      let matchLength = 0;
      while (
        matchLength < lookAhead.length &&
        windowText[i + matchLength] === lookAhead[matchLength]
      ) {
        matchLength++;
      }
      if (matchLength > bestMatch.length) {
        bestMatch = {
          offset: position - (windowStart + i),
          length: matchLength,
        };
      }
    }

    const nextChar = text[position + bestMatch.length] || '';
    const dictionaryIndex = dictionary.length;

    if (bestMatch.length > 0) {
      dictionary.push(lookAhead.substring(0, bestMatch.length + 1));
    }

    steps.push({
      position,
      offset: bestMatch.offset,
      length: bestMatch.length,
      nextChar,
      dictionaryIndex,
      message: `Match at offset ${bestMatch.offset}, length ${bestMatch.length}, next char: '${nextChar}'`,
    });

    position += bestMatch.length + 1;
  }

  return { steps, dictionary };
}

// Calculate compression metrics
export function calculateMetrics(
  originalSize: number,
  compressedSize: number,
  avgBitsPerSymbol: number
) {
  const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2);
  const originalBits = originalSize * 8;
  const savedBits = (originalBits - compressedSize * 8).toFixed(0);

  return {
    compressionRatio: ratio,
    savedBits,
    originalBits,
    compressedSize,
  };
}
