# Comparison Algorithms Visualizer

A modern Next.js web application for learning, comparing, and visualizing classic information theory and graph algorithms through interactive UI and step-by-step animations.

This project is designed for students, developers, and researchers who want to understand how algorithms work internally, not just see the final output.

---

## Features

* Documentation section for each algorithm
* Comparison section to evaluate algorithms side-by-side
* Step-by-step visualizations of algorithm execution
* Focused on learning through interaction
* Clean, minimal, responsive UI
* Built with Next.js for performance and scalability

---

## Implemented Algorithms

### 1. Huffman Coding Algorithm

A greedy compression algorithm that builds an optimal prefix tree based on character frequencies.

Visualization includes:

* Frequency table generation
* Priority queue evolution
* Tree construction
* Final binary codes per symbol

---

### 2. Fano Algorithm

A top-down compression method that recursively divides symbols into two groups based on probability.

Visualization includes:

* Sorted probability table
* Recursive splitting process
* Code assignment per recursion

---

### 3. Shannon–Fano–Elias Algorithm

An extension of Shannon–Fano coding that uses cumulative probabilities to generate uniquely decodable binary codes.

Visualization includes:

* Cumulative distribution values
* Binary expansion process
* Final encoded outputs

---

### 4. Lempel–Ziv Algorithm (LZ Family)

A dictionary-based compression technique that dynamically builds patterns from the input stream.

Visualization includes:

* Window buffer updates
* Dictionary growth
* Token generation steps

---

### 5. Hamilton Algorithm (Hamiltonian Path/Cycle)

Graph-based algorithm that attempts to find a path or cycle visiting each vertex exactly once.

Visualization includes:

* Graph node exploration
* Backtracking steps
* Valid/invalid path detection

---

## Project Sections

### Documentation Section

Each algorithm has its own documentation page containing:

* Conceptual explanation
* Mathematical intuition
* Step-by-step breakdown
* Example inputs and outputs

This allows users to understand theory before interacting with visualization.

---

### Comparison Section

The comparison view allows users to analyze algorithms side-by-side based on:

* Time complexity
* Space complexity
* Compression efficiency (where applicable)
* Execution steps
* Practical use cases

This helps learners develop a deeper intuition about trade-offs.

---

### Visualization Engine

Each algorithm includes a custom visualization system that:

* Animates each step clearly
* Highlights active elements (nodes, symbols, edges, buffers)
* Shows transitions between states
* Makes abstract processes tangible

The goal is not just to show results, but to teach the algorithm visually.

---

## Built With

* Next.js – React framework for production
* TypeScript – Type safety and maintainability
* Tailwind CSS – Utility-first modern styling
* Custom visualization components – Built without heavy external chart libraries

---

## Installation

```bash
git clone https://github.com/your-username/comparison-algorithms-visualizer.git
cd comparison-algorithms-visualizer
npm install
npm run dev
```

Then open:

```
http://localhost:3000
```

---

## Target Audience

* Computer science students
* Algorithm learners
* Educators and instructors
* Developers preparing for interviews
* Anyone curious about how algorithms really work

---

## Project Vision

"Don’t just read algorithms — see them think."

This project focuses on making algorithm learning:

* Visual instead of abstract
* Interactive instead of passive
* Intuitive instead of intimidating

---

## Contributions

Contributions are welcome.

You can help by:

* Adding new algorithms
* Improving visualizations
* Enhancing UI/UX
* Fixing bugs or improving performance

---

## License

This project is open-source and available under the MIT License.

---

If you would like, I can also help you add:

* Badges (build, license, version)
* Screenshots section
* Demo link section
* Academic-style documentation
* GitHub Pages deployment guide
