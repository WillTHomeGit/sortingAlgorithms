REALLY IMPORTANT RIGHT HERE SUPER IMPORTANT

When running 
    npm run benchmark

or 
    npm run build
    node dist/runners/performance-test.js

the test !!! WILL TAKE A REALLY LONG TIME !!! >= 4 minutes on a slow computer. (~5 minutes for me)

To speed up the program, 
    Navigate to   src/benchmarking/services/benchmark.config.ts
    Find and change  MAX_EXECUTION_TIME_MS  to anything less than it's current value.
    Values of < 10 will result in much larger magnitudes of variability in the benchmarks.
    RECOMMENDED MAX_EXECUTION_TIME_MS VALUE = ~30
    


---

# TypeScript Sorting Algorithm Benchmark Suite

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

This project is a comprehensive benchmark suite for various sorting algorithms, written in a modern, modular TypeScript environment. It is designed to measure, test, and visualize the performance of different algorithms across a wide variety of data scenarios, such as random, sorted, nearly sorted, and sparse arrays.

More than just a performance tool, this project serves as a practical demonstration of data structures, algorithms, and software design principles. It highlights best practices like separation of concerns, configuration-driven development, service-oriented architecture, and test automation with Jest.

## Key Features

-   **Comprehensive Algorithm Library:** Includes a wide range of sorting algorithms, from classic comparison sorts to specialized integer sorts.
-   **Advanced Performance Benchmarking:** Measures execution time across various array sizes and data patterns with high-resolution timers. Includes intelligent "bail-out" logic to automatically stop testing algorithms that become too slow (e.g., detecting O(n²) behavior) to keep the benchmark runs efficient.
-   **Multi-Scenario Testing:** Evaluates algorithms against diverse and challenging datasets, including random integers/floats, sorted, reversed, nearly sorted, and arrays with many duplicates or sparse value distributions.
-   **In-Depth Visual Analysis:** Generates an interactive HTML report with **two types of charts** per scenario:
    1.  **Raw Performance (Log-Log):** Compares the raw execution time of algorithms.
    2.  **Speedup Ratio vs. Median:** Normalizes results to show how many times faster or slower each algorithm is compared to the median performer, making it easy to identify the best algorithm for a given task.
-   **Correctness & Immutability Testing:** Uses Jest to rigorously verify that each algorithm produces a correctly sorted output and, critically, **does not mutate the input array**.
-   **Configuration-Driven & Extensible:** Easily add new algorithms, test scenarios, or array sizes by editing simple configuration files, without modifying the core benchmarking logic.

## Implemented Algorithms

The suite includes the following algorithms, with special notes on their implementation:

| Category          | Algorithm              | Notes                                                               |
| ----------------- | ---------------------- | ------------------------------------------------------------------- |
| **Comparison**    | Bubble Sort            | The classic implementation.                                         |
|                   | Bubble Sort (Smart)    | Optimized with early termination and last-swap tracking.            |
|                   | Insertion Sort         | Efficient for small or nearly-sorted datasets.                      |
|                   | Selection Sort         | Simple, but generally inefficient.                                  |
|                   | Merge Sort             | A classic O(n log n) recursive implementation.                      |
|                   | Quick Sort             | A robust implementation using median-of-three pivot & tail-call optimization. |
|                   | Heap Sort              | An in-place O(n log n) implementation.                              |
|                   | Shell Sort             | Uses Knuth's gap sequence for improved performance over Insertion Sort. |
| **Specialized**   | Counting Sort          | *For non-negative integers only.* Extremely fast for dense data.      |
|                   | Radix Sort (LSD)       | *For non-negative integers only.* Sorts digit by digit.               |
|                   | Bitwise Radix Sort     | *For non-negative integers only.* An alternate Radix implementation.  |
|                   | Bucket Sort            | Distributes elements into buckets, which are then sorted using Insertion Sort. |
| **Hybrid/Native** | Timsort (Native)       | A wrapper for the highly optimized native `Array.prototype.sort`.   |

## Prerequisites

Before you begin, ensure you have the following installed on your system:

-   [Node.js](https://nodejs.org/en/) (v16 or later recommended)
-   npm (which is included with Node.js)

## Setup and Installation

Follow these steps to get the project up and running on your local machine.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/WillTHomeGit/sortingAlgorithms
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd sortingalgorithms
    ```

3.  **Install the dependencies:**
    This command will install all necessary libraries, such as Jest, TypeScript, and ts-node.
    ```bash
    npm install
    ```

## How to Run the Project

The project is controlled via npm scripts. The recommended workflow ensures correctness before generating performance data and reports.

#### 1. Run Correctness Tests (Recommended)

This command runs the Jest test suite to verify that every algorithm sorts correctly and adheres to the project's immutability requirements.

```bash
npm run test
```

#### 2. Run the Performance Benchmark

This command executes the main performance test. It runs all configured algorithms against all compatible scenarios and generates a raw data file at `reports/performance-results.json`.

```bash
npm run benchmark
```

#### 3. Generate the Visual Report

After the benchmark is complete, use this command to generate an interactive HTML report. It reads the raw data and creates a viewable file at `reports/benchmark_plot.html`.

```bash
npm run plot
```

You can now open `reports/benchmark_plot.html` in your web browser to see the interactive charts and analyze the results.

## Project Architecture

The project is designed with a strong **separation of concerns** to make it easy to maintain and extend. The core logic is split into several well-defined modules:

1.  **`src/algorithms/`**: Contains the standalone implementation of each sorting algorithm. Each file exports a pure function that takes an array and returns a new, sorted array.

2.  **`src/config/`**: The "control panel" of the suite.
    -   `algorithms.config.ts`: A master list of all sorting algorithms to be tested.
    -   `test-scenarios.config.ts`: Defines the different data conditions to test against (random, sorted, etc.).
    -   `performance-test.config.ts`: Defines the array sizes to be used in tests.

3.  **`src/benchmarking/`**: The core engine for running performance tests.
    -   `benchmark-runner.ts`: The orchestrator that loops through algorithms, scenarios, and sizes. It contains the logic for measuring time and bailing out of overly slow tests.
    -   `services/`: A collection of focused services for logging (`LoggerService`), generating test data (`TestDataGenerator`), and managing results (`ResultManager`).

4.  **`src/analysis/`**: The presentation layer.
    -   `plotGenerator.ts`: A standalone script that reads the JSON data generated by the benchmark and uses Chart.js to create a user-friendly HTML report with powerful data visualizations.

5.  **`src/runners/`**: The entry points for executing tasks.
    -   `performance-tester.ts`: The main script that composes and runs the benchmark engine.
    -   `correctness.test.ts`: The Jest test file that dynamically creates test cases for every algorithm and scenario.

This decoupled architecture means the `plotGenerator` doesn't need to know how the benchmark was run; it only needs the final data file.

## How to Add a New Algorithm

The project is designed to make adding new algorithms simple:

1.  **Create the Algorithm File:**
    -   Create a new file in `src/algorithms/`, for example, `myNewSort.ts`.
    -   Write and export your sorting function from this file. It **must** take an array of numbers and return a **new**, sorted array without modifying the original.

2.  **Export from the Barrel File:**
    -   Open `src/algorithms/index.ts` and add a new export line: `export * from './myNewSort';`

3.  **Add to the Configuration:**
    -   Open `src/config/algorithms.config.ts`.
    -   Import your new algorithm at the top.
    -   Add a new object to the `ALGORITHMS_TO_TEST` array. If your algorithm only works on non-negative integers, be sure to add the `accepts: 'integers'` property.
        ```typescript
        {
          name: 'My New Sort',
          fn: algorithms.myNewSort,
          // accepts: 'integers' // Add this line if it only works on integers!
        }
        ```

That's it! The performance and correctness runners will automatically pick up your new algorithm the next time they are run.
