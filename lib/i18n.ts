export type Language = 'en' | 'fa';

export const translations = {
  en: {
    // Header
    header: {
      title: 'Algorithm Visualizer',
      subtitle: 'Learn compression and graph algorithms step by step',
    },
    // Navigation
    nav: {
      algorithms: 'Algorithms',
      compare: 'Compare',
      documentation: 'Documentation',
      language: 'Language',
    },
    // Algorithm Types
    algorithmTypes: {
      compression: 'Compression Algorithms',
      errorCorrection: 'Error Correction',
      graph: 'Graph Algorithms',
    },
    // Algorithms
    algorithms: {
      huffman: 'Huffman Coding',
      fano: 'Fano Algorithm',
      shannonFanoElias: 'Shannon-Fano-Elias Coding',
      lempelZiv: 'Lempel-Ziv Compression',
      hamming: 'Hamming Code',
      hamilton: 'Hamilton Cycle',
    },
    // Common UI
    button: {
      play: 'Play',
      pause: 'Pause',
      next: 'Next',
      previous: 'Previous',
      reset: 'Reset',
      add: 'Add',
      remove: 'Remove',
      compare: 'Compare',
      test: 'Test',
      generate: 'Generate',
      symbol: 'Symbol',
      probability: 'Probability',
    },
    // Huffman
    huffman: {
      title: 'Huffman Coding',
      description: 'Huffman coding is a greedy algorithm that builds an optimal prefix-free code by repeatedly combining the two least frequent nodes.',
      explanation: `
        Huffman coding is a lossless data compression technique that assigns variable-length codes to characters based on their frequency.
        
        Key Points:
        • The most frequent characters get shorter binary codes
        • The least frequent characters get longer codes
        • It builds a binary tree from bottom-up by combining pairs of nodes
        • The algorithm is optimal for prefix-free codes
        
        Time Complexity: O(n log n) where n is the number of unique characters
        Space Complexity: O(n)
        
        Use Cases:
        • Image compression (JPEG)
        • Text compression
        • Audio compression
      `,
      enterSymbols: 'Enter symbols and their probabilities',
      symbol: 'Symbol',
      probability: 'Probability',
      code: 'Code',
      step: 'Step',
      totalSteps: 'Total Steps',
      averageBits: 'Avg Bits/Symbol',
      fixedEncoding: 'Fixed Encoding',
      compressionRatio: 'Compression Ratio',
    },
    // Fano
    fano: {
      title: 'Fano Algorithm',
      description: 'Fano algorithm creates variable-length codes by recursively dividing a set of symbols based on cumulative probability.',
      explanation: `
        The Fano algorithm, also known as Shannon-Fano coding, assigns binary codes by dividing symbols into two groups with approximately equal probability.
        
        Key Points:
        • Divides symbols into two groups at each step
        • Each group gets a bit prefix (0 or 1)
        • Recursively processes subgroups
        • Similar to Huffman but builds top-down
        
        Time Complexity: O(n log n) where n is the number of unique characters
        Space Complexity: O(n)
        
        Comparison with Huffman:
        • Fano is generally less optimal than Huffman
        • Simpler to understand conceptually
        • Faster to compute in practice
      `,
      enterSymbols: 'Enter symbols sorted by probability (high to low)',
      symbol: 'Symbol',
      probability: 'Probability',
      code: 'Code',
      averageBits: 'Avg Bits/Symbol',
    },
    // Shannon-Fano-Elias
    shannonFanoElias: {
      title: 'Shannon-Fano-Elias Coding',
      description: 'An arithmetic coding variant that assigns codes based on cumulative probability distribution.',
      explanation: `
        Shannon-Fano-Elias is a method of entropy encoding that provides efficient compression by considering the cumulative probability distribution.
        
        Key Points:
        • Uses cumulative probability to determine code boundaries
        • Assigns variable-length codes
        • Guaranteed to produce codes shorter than arithmetic coding in worst case
        • Foundation for modern arithmetic coding
        
        Time Complexity: O(n log n)
        Space Complexity: O(n)
        
        Algorithm Steps:
        1. Sort symbols by probability
        2. Calculate cumulative probability
        3. Calculate code length for each symbol
        4. Generate binary code from cumulative value
      `,
      cumulativeProbability: 'Cumulative Prob',
      codeLength: 'Code Length',
      code: 'Code',
    },
    // Lempel-Ziv
    lempelZiv: {
      title: 'Lempel-Ziv Compression',
      description: 'A dictionary-based compression algorithm that builds a codebook of recurring patterns.',
      explanation: `
        Lempel-Ziv (LZ) is a lossless data compression method that replaces repeated sequences of characters with shorter codes.
        
        Key Points:
        • Dictionary-based (not statistical)
        • Builds codebook dynamically during compression
        • Works well with files containing repeated patterns
        • Foundation for gzip and DEFLATE
        
        LZ77 (Sliding Window):
        • Searches previous data for matching patterns
        • Encodes as (offset, length, next character)
        
        LZ78 (Dictionary):
        • Builds explicit dictionary of patterns
        • Encodes as (dictionary index, new character)
        
        Time Complexity: O(n) with proper implementation
        Space Complexity: O(d) where d is dictionary size
        
        Use Cases:
        • GIF, TIFF compression
        • ZIP archives
        • Modem transmission protocols
      `,
      originalText: 'Original Text',
      compressed: 'Compressed',
      compressionRatio: 'Compression Ratio',
      dictionary: 'Dictionary',
      pattern: 'Pattern',
      code: 'Code',
    },
    // Hamming Code
    hamming: {
      title: 'Hamming(7,4) Code',
      description: 'Error detection and correction code that adds parity bits to detect and fix single-bit errors.',
      encoding: 'Cumulative Probability Encoding',
      codes: 'Hamming Codes',
      step: 'Step',
    },
    // Hamilton
    hamilton: {
      title: 'Hamilton Cycle',
      description: 'A cycle in a graph that visits every vertex exactly once.',
      explanation: `
        A Hamilton cycle (or Hamiltonian cycle) is a path in a graph that:
        • Visits each vertex exactly once
        • Returns to the starting vertex
        • Forms a cycle of length n (where n is the number of vertices)
        
        Key Properties:
        • Not all graphs have a Hamilton cycle
        • Finding one is NP-complete
        • Different from Euler cycles (which visit edges instead of vertices)
        
        Applications:
        • Traveling Salesman Problem (TSP)
        • Network routing
        • Robot motion planning
        • DNA sequencing
        
        Finding Hamilton Cycles:
        • Backtracking algorithm (exponential time)
        • Approximation algorithms
        • Heuristics for specific problem classes
      `,
      nodes: 'Nodes',
      edges: 'Edges',
      addNode: 'Add Node',
      addEdge: 'Add Edge',
      removeNode: 'Remove Node',
      removeEdge: 'Remove Edge',
      findCycle: 'Find Cycle',
      testCycle: 'Test Cycle',
      validCycle: 'Valid Cycle',
      invalidCycle: 'Invalid Cycle',
      cyclePath: 'Cycle Path',
      noCycleFound: 'No Cycle Found',
      nodeCount: 'Node Count',
      edgeCount: 'Edge Count',
    },
    // Comparison
    compare: {
      title: 'Algorithm Comparison',
      timeComplexity: 'Time Complexity',
      spaceComplexity: 'Space Complexity',
      avgCase: 'Average Case',
      worstCase: 'Worst Case',
      bestCase: 'Best Case',
      benchmark: 'Execution Time Benchmark',
      useCases: 'Use Cases',
      pros: 'Advantages',
      cons: 'Disadvantages',
      testSpeed: 'Test Speed',
      dataSize: 'Data Size',
      executionTime: 'Execution Time',
      iterations: 'Iterations',
      milliseconds: 'ms',
      bytes: 'bytes',
    },
    // Documentation
    documentation: {
      title: 'Documentation',
      gettingStarted: 'Getting Started',
      theory: 'Theory',
      implementation: 'Implementation',
      examples: 'Examples',
    },
  },
  fa: {
    // Header
    header: {
      title: 'تصور سازی الگوریتم',
      subtitle: 'یادگیری الگوریتم های فشرده سازی و نمودار گام به گام',
    },
    // Navigation
    nav: {
      algorithms: 'الگوریتم ها',
      compare: 'مقایسه',
      documentation: 'مستندات',
      language: 'زبان',
    },
    // Algorithm Types
    algorithmTypes: {
      compression: 'الگوریتم های فشرده سازی',
      errorCorrection: 'تصحیح خطا',
      graph: 'الگوریتم های نمودار',
    },
    // Algorithms
    algorithms: {
      huffman: 'کدگذاری هافمن',
      fano: 'الگوریتم فانو',
      shannonFanoElias: 'کدگذاری شانون-فانو-الیاس',
      lempelZiv: 'فشرده سازی لمپل-زیو',
      hamming: 'کد همینگ',
      hamilton: 'دور همیلتون',
    },
    // Common UI
    button: {
      play: 'شروع',
      pause: 'متوقف کردن',
      next: 'بعدی',
      previous: 'قبلی',
      reset: 'بازنشانی',
      add: 'افزودن',
      remove: 'حذف کردن',
      compare: 'مقایسه',
      test: 'آزمایش',
      generate: 'تولید',
      symbol: 'نویسه',
      probability: 'احتمال',
    },
    // Huffman
    huffman: {
      title: 'کدگذاری هافمن',
      description: 'کدگذاری هافمن الگوریتمی حریصانه است که با ترکیب مکرر دو گره با کمترین فرکانس یک کد بدون پیشوند بهینه ساخته می شود.',
      explanation: `
        کدگذاری هافمن یک تکنیک فشرده سازی داده های بدون تلفات است که کدهای متغیر الطول را بر اساس فرکانس نویسه ها اختصاص می دهد.
        
        نکات کلیدی:
        • نویسه های با فرکانس بیشتر کدهای باینری کوتاه تر دریافت می کنند
        • نویسه های با فرکانس کمتر کدهای طولانی تر دریافت می کنند
        • الگوریتم یک درخت باینری را از پایین به بالا با ترکیب جفت گره ها می سازد
        • الگوریتم برای کدهای بدون پیشوند بهینه است
        
        پیچیدگی زمانی: O(n log n) که n تعداد نویسه های منحصر به فرد است
        پیچیدگی فضای: O(n)
        
        موارد استفاده:
        • فشرده سازی تصویر (JPEG)
        • فشرده سازی متن
        • فشرده سازی صوت
      `,
      enterSymbols: 'نویسه ها و احتمالات آنها را وارد کنید',
      symbol: 'نویسه',
      probability: 'احتمال',
      code: 'کد',
      step: 'مرحله',
      totalSteps: 'کل مراحل',
      averageBits: 'میانگین بیت/نویسه',
      fixedEncoding: 'رمزگذاری ثابت',
      compressionRatio: 'نسبت فشرده سازی',
    },
    // Fano
    fano: {
      title: 'الگوریتم فانو',
      description: 'الگوریتم فانو کدهای متغیر الطول را با تقسیم بندی بازگشتی مجموعه ای از نویسه ها بر اساس احتمال تجمعی ایجاد می کند.',
      explanation: `
        الگوریتم فانو، همچنین به عنوان کدگذاری شانون-فانو شناخته می شود، کدهای باینری را با تقسیم بندی نویسه ها به دو گروه با احتمال تقریباً برابر اختصاص می دهد.
        
        نکات کلیدی:
        • در هر مرحله نویسه ها را به دو گروه تقسیم می کند
        • هر گروه یک پیشوند بیتی (0 یا 1) دریافت می کند
        • به طور بازگشتی زیر گروه ها را پردازش می کند
        • مانند هافمن اما از بالا به پایین می سازد
        
        پیچیدگی زمانی: O(n log n) که n تعداد نویسه های منحصر به فرد است
        پیچیدگی فضای: O(n)
        
        مقایسه با هافمن:
        • فانو عموماً کمتر از هافمن بهینه است
        • مفهومی ساده تر است
        • عملی تر محاسبه می شود
      `,
      enterSymbols: 'نویسه ها را مرتب شده بر اساس احتمال (بیشتر به کمتر) وارد کنید',
      symbol: 'نویسه',
      probability: 'احتمال',
      code: 'کد',
      averageBits: 'میانگین بیت/نویسه',
    },
    // Shannon-Fano-Elias
    shannonFanoElias: {
      title: 'کدگذاری شانون-فانو-الیاس',
      description: 'یک نوع کدگذاری حسابی که کدها را بر اساس توزیع احتمال تجمعی اختصاص می دهد.',
      explanation: `
        کدگذاری شانون-فانو-الیاس روشی برای رمزگذاری آنتروپی است که فشرده سازی مؤثری را با در نظر گرفتن توزیع احتمال تجمعی فراهم می کند.
        
        نکات کلیدی:
        • احتمال تجمعی را برای تعیین مرزهای کد استفاده می کند
        • کدهای متغیر الطول اختصاص می دهد
        • تضمین می کند کدهایی کوتاه تر از کدگذاری حسابی در بدترین حالت تولید کند
        • بنیاد کدگذاری حسابی مدرن است
        
        پیچیدگی زمانی: O(n log n)
        پیچیدگی فضای: O(n)
        
        مراحل الگوریتم:
        1. نویسه ها را بر اساس احتمال مرتب کنید
        2. احتمال تجمعی را محاسبه کنید
        3. طول کد برای هر نویسه را محاسبه کنید
        4. کد باینری را از مقدار تجمعی تولید کنید
      `,
      cumulativeProbability: 'احتمال تجمعی',
      codeLength: 'طول کد',
      code: 'کد',
    },
    // Lempel-Ziv
    lempelZiv: {
      title: 'فشرده سازی لمپل-زیو',
      description: 'الگوریتم فشرده سازی مبتنی بر فرهنگ لغت که الگوهای تکراری را با کدهای کوتاه تر جایگزین می کند.',
      explanation: `
        لمپل-زیو (LZ) روش فشرده سازی داده های بدون تلفات است که دنباله های تکراری نویسه ها را با کدهای کوتاه تر جایگزین می کند.
        
        نکات کلیدی:
        • مبتنی بر فرهنگ لغت (نه آماری)
        • فرهنگ لغت را به طور پویا در طی فشرده سازی می سازد
        • برای فایل های حاوی الگوهای تکراری خوب کار می کند
        • بنیاد gzip و DEFLATE است
        
        LZ77 (پنجره کشویی):
        • داده های قبلی را برای الگوهای مطابق جستجو می کند
        • به عنوان (تغییر مکان، طول، نویسه بعدی) رمزگذاری می کند
        
        LZ78 (فرهنگ لغت):
        • فرهنگ لغت صریح الگوها را می سازد
        • به عنوان (شاخص فرهنگ لغت، نویسه جدید) رمزگذاری می کند
        
        پیچیدگی زمانی: O(n) با اجرای مناسب
        پیچیدگی فضای: O(d) که d اندازه فرهنگ لغت است
        
        موارد استفاده:
        • فشرده سازی GIF، TIFF
        • بایگانی ZIP
        • پروتکل های انتقال مودم
      `,
      originalText: 'متن اصلی',
      compressed: 'فشرده شده',
      compressionRatio: 'نسبت فشرده سازی',
      dictionary: 'فرهنگ لغت',
      pattern: 'الگو',
      code: 'کد',
    },
    // Hamming Code
    hamming: {
      title: 'کد همینگ(7,4)',
      description: 'کد تشخیص و تصحیح خطا که بیت های تعادل را اضافه می کند تا خطای تک بیتی را تشخیص و تصحیح کند.',
      encoding: 'رمزگذاری احتمال تجمعی',
      codes: 'کدهای همینگ',
      step: 'مرحله',
    },
    // Hamilton
    hamilton: {
      title: 'دور همیلتون',
      description: 'دوری در نمودار که هر راس را دقیقاً یک بار بازدید می کند.',
      explanation: `
        دور همیلتون (یا چرخه همیلتون) مسیری در نمودار است که:
        • هر راس را دقیقاً یک بار بازدید می کند
        • به راس شروع بازمی گردد
        • چرخه ای از طول n را تشکیل می دهد (که n تعداد رئوس است)
        
        خصوصیات کلیدی:
        • نه تمام نمودارها دارای دور همیلتون هستند
        • یافتن یکی NP-complete است
        • متفاوت از چرخه های اویلر (که از لبه ها بجای رئوس بازدید می کنند)
        
        کاربردها:
        • مسئله فروشنده دوره گرد (TSP)
        • مسیریابی شبکه
        • برنامه ریزی حرکت ربات
        • توالی یابی DNA
        
        یافتن دور های همیلتون:
        • الگوریتم بازگشتی (زمان نمایی)
        • الگوریتم های تقریبی
        • ابتکارات برای کلاس های مسئله خاص
      `,
      nodes: 'رئوس',
      edges: 'لبه ها',
      addNode: 'افزودن راس',
      addEdge: 'افزودن لبه',
      removeNode: 'حذف راس',
      removeEdge: 'حذف لبه',
      findCycle: 'یافتن دور',
      testCycle: 'آزمایش دور',
      validCycle: 'دور معتبر',
      invalidCycle: 'دور نامعتبر',
      cyclePath: 'مسیر دور',
      noCycleFound: 'دوری یافت نشد',
      nodeCount: 'تعداد رئوس',
      edgeCount: 'تعداد لبه ها',
    },
    // Comparison
    compare: {
      title: 'مقایسه الگوریتم',
      timeComplexity: 'پیچیدگی زمانی',
      spaceComplexity: 'پیچیدگی فضای',
      avgCase: 'حالت متوسط',
      worstCase: 'بدترین حالت',
      bestCase: 'بهترین حالت',
      benchmark: 'معیار زمان اجرا',
      useCases: 'موارد استفاده',
      pros: 'مزایا',
      cons: 'معایب',
      testSpeed: 'سنجش سرعت',
      dataSize: 'اندازه داده',
      executionTime: 'زمان اجرا',
      iterations: 'تکرارها',
      milliseconds: 'ms',
      bytes: 'بایت',
    },
    // Documentation
    documentation: {
      title: 'مستندات',
      gettingStarted: 'شروع کردن',
      theory: 'نظریه',
      implementation: 'اجرا',
      examples: 'نمونه ها',
    },
  },
} as const;

export const getTranslation = (lang: Language) => translations[lang];
