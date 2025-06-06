// benchmarking.ts (or benchmarking.js with `"type": "module"` in package.json)

import { bubbleSort, bubbleSortSmart, insertionSort, selectionSort, mergeSort, quickSort, countingSort, radixSort, bitwiseRadixSort, heapSort, shellSort } from "./sortingAlgorithms"; // Assuming you have these
import Benchmark from "benchmark";
import { Performance } from "perf_hooks";
import fs from "fs"; // Node.js File System module
import path from "path"; // Node.js Path module

//
// 0) Define a place to store all results for plotting
//
interface ResultData {
  size: number;
  hz: number; // Operations per second
  rme: number; // Relative Margin of Error
}

interface AllResults {
  [algorithmName: string]: ResultData[];
}

const allBenchmarkResults: AllResults = {};

//
// 1) Specify the sizes we want to test.
//
const testNumbers = [
  10,
  50,
  100,
  250,
  500,
  1_000,
  1_500,
  2_000,
  3_500,
  5_000,
  10_000,
  20_000,
  30_000,
];

const algorithmFunctions = [
  bubbleSort, bubbleSortSmart, insertionSort, selectionSort, mergeSort, 
  quickSort, countingSort, radixSort, bitwiseRadixSort, heapSort, shellSort
];

// Define which algorithms should be skipped for large tests.
const slowAlgorithmFunctions = [
  bubbleSort,
  bubbleSortSmart,
  insertionSort,
  selectionSort
];

//
// 2) Pre-generate one random array for each size
//
console.log("Generating test arrays...");
const testArrays: number[][] = testNumbers.map((n) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * n * 2))
);
console.log("Test arrays generated.");


const incrementalTestArrayResults : number[][] = [];

for (let i = 0; i < algorithmFunctions.length; i++) {
  incrementalTestArrayResults.push([]);
}

function runIncrementalArraySizedTests() {
  // --- Configuration ---
  const MAX_TEST_SIZE = 30_000;
  const SLOW_TEST_THRESHOLD = 2_500; // Stop testing slow sorts after this size
  const SAMPLES_PER_SIZE = 50;       // Run each test 5 times and average the result
  const GROWTH_FACTOR = 1.1;        // Increase array size by 20% each step
  const STARTING_SIZE = 10;

  // --- 1. Generate our list of test sizes that grow exponentially ---
  const incrementalTestSizes = [];
  let currentSize = STARTING_SIZE;
  while (currentSize <= MAX_TEST_SIZE) {
    incrementalTestSizes.push(Math.floor(currentSize));
    currentSize *= GROWTH_FACTOR;
  }
  console.log("Generated test sizes for incremental test:", incrementalTestSizes);

  // --- 2. Loop through our new, smarter list of sizes ---
  for (const size of incrementalTestSizes) {
    
    // --- 3. Loop through each algorithm ---
    for (let j = 0; j < algorithmFunctions.length; j++) {
      const currentAlgorithm = algorithmFunctions[j];

      // Skip slow algorithms on large arrays
      if (size > SLOW_TEST_THRESHOLD && slowAlgorithmFunctions.includes(currentAlgorithm)) {
        continue; 
      }

      const sampleResults: number[] = [];
      // --- 4. Run multiple samples for this size and average them ---
      for (let s = 0; s < SAMPLES_PER_SIZE; s++) {
        // Generate a new random array for EACH sample to ensure fairness
        const incrementalTestArray: number[] = Array.from({ length: size }, () => Math.floor(Math.random() * size * 2));
        
        const start = performance.now();
        currentAlgorithm(incrementalTestArray);
        const result = performance.now() - start;
        sampleResults.push(result);
      }

      // Calculate the average of the samples
      const averageTime = sampleResults.reduce((a, b) => a + b, 0) / SAMPLES_PER_SIZE;
      
      // Store the single, stable, averaged result
      incrementalTestArrayResults[j][size] = averageTime;
    }
    
    // Progress logger
    console.log(`Finished tests for size: ${size}`);
  }
}

//
// 3) A helper function that, given an index, runs a Benchmark.Suite for that size
//
function runSuiteForSize(index: number) {
  if (index >= testNumbers.length) {
    console.log("\n🏁 All benchmarks complete!");
    generatePlots(allBenchmarkResults); // Call the updated plotting function
    return;
  }

  const size = testNumbers[index];
  const data = testArrays[index];

  console.log(`\n--- Benchmark for array size = ${size} ---`);
  const suite = new Benchmark.Suite();

  suite
    .add({
    name: `Bubble Sort (${size})`,
    fn: () => {
      bubbleSort([...data]);
    },
      // This line adds maxTime: 5 ONLY if size > 5000
      // ...(size > 1000 && { maxTime: 2 }) 
      maxTime:2                               //1283971283714
    })
    .add({
    name: `Bubble Sort Smart (${size})`,
    fn: () => {
      bubbleSortSmart([...data]);
    },
      // This line adds maxTime: 5 ONLY if size > 5000
      // ...(size > 1000 && { maxTime: 2 }) 
      maxTime:2                               //1283971283714
    })
    .add({
    name: `Insertion Sort (${size})`,
    fn: () => {
      insertionSort([...data]);
    },
      // This line adds maxTime: 5 ONLY if size > 5000
      // ...(size > 1000 && { maxTime: 2 }) 
      maxTime:2                               //1283971283714
    })
    .add({
    name: `Selection Sort (${size})`,
    fn: () => {
      selectionSort([...data]);
    },
      // This line adds maxTime: 5 ONLY if size > 5000
      // ...(size > 1000 && { maxTime: 2 }) 
      maxTime:2                               //1283971283714
    })
    .add({
    name: `Merge Sort (${size})`,
    fn: () => {
      mergeSort([...data]);
    },
      // This line adds maxTime: 5 ONLY if size > 5000
      // ...(size < 1000 && { maxTime: 2 }) 
      maxTime:2                               //1283971283714
    })
    .add({
    name: `Quick Sort (${size})`,
    fn: () => {
      quickSort([...data]);
    },
      // This line adds maxTime: 5 ONLY if size > 5000
      // ...(size < 1000 && { maxTime: 2 }) 
      maxTime:2                               //1283971283714
    })
    .add({
    name: `Counting Sort (${size})`,
    fn: () => {
      countingSort([...data]);
    },
      // This line adds maxTime: 5 ONLY if size > 5000
      // ...(size < 1000 && { maxTime: 2 }) 
      maxTime:2                                 //1283971283714
    })
    .add({
    name: `Radix Sort (${size})`,
    fn: () => {
      radixSort([...data]);
    },
      // This line adds maxTime: 5 ONLY if size > 5000
      // ...(size < 1000 && { maxTime: 2 }) 
      maxTime:2                               //1283971283714
    })
    .add({
    name: `Bitwise Radix Sort (${size})`,
    fn: () => {
      bitwiseRadixSort([...data]);
    },
      // This line adds maxTime: 5 ONLY if size > 5000
      // ...(size < 1000 && { maxTime: 2 }) 
      maxTime:2                               //1283971283714
    })
    .add({
    name: `Heap Sort (${size})`,
    fn: () => {
      heapSort([...data]);
    },
      // This line adds maxTime: 5 ONLY if size > 5000
      // ...(size < 1000 && { maxTime: 2 }) 
      maxTime:2                               //1283971283714
    })
    .add({
    name: `Shell Sort (${size})`,
    fn: () => {
      shellSort([...data]);
    },
      // This line adds maxTime: 5 ONLY if size > 5000
      // ...(size < 1000 && { maxTime: 2 }) 
      maxTime:2                               //1283971283714
    })
    // Add more algorithms here if you have them
    .on("cycle", function (event: Benchmark.Event) {
      console.log(String(event.target));
    })
    .on("complete", function (this: Benchmark.Suite) {
    console.log("Suite complete.");

    // 1. Convert the benchmark suite results into a proper array.
    const results: Benchmark[] = [];
    this.forEach((bench: Benchmark) => {
      results.push(bench);
    });

    // 2. Sort the array in descending order based on ops/sec (hz).
    //    The fastest benchmarks (higher hz) will come first.
    results.sort((a, b) => b.hz - a.hz);

    // 3. Loop through the *sorted* results to print them and store them for the chart.
    results.forEach((bench: Benchmark) => {
        // This part is the same as your old code, it just runs on the sorted array now.
        const nameMatch = bench.name?.match(/^(.*?)\s*\(\d+\)$/);
        const algorithmName = nameMatch ? nameMatch[1] : bench.name || "Unknown Algorithm";

        if (!allBenchmarkResults[algorithmName]) {
            allBenchmarkResults[algorithmName] = [];
        }
        allBenchmarkResults[algorithmName].push({
            size: size,
            hz: bench.hz,
            rme: bench.stats.rme,
        });

        // Your original printing logic, now printing a line from the sorted array.
        console.log(
            `${(bench.name ?? "")}:`.padEnd(35) + 
            `${bench.hz.toFixed(2)} ops/sec (±${bench.stats.rme.toFixed(2)}%)`
            // Note: I removed the second .padEnd() as it can cause alignment issues
            // when numbers have different lengths. The first padEnd on the name is usually sufficient.
        );
    });
    
    // Call the next suite after all processing is done.
    runSuiteForSize(index + 1);
    })
    .run({ async: true });
}




//
// 4) Function to generate HTML plots using Chart.js
//
function generatePlots(results: AllResults) {
  const algorithmFunctionNames = [
    'Bubble Sort', 'Bubble Sort Smart', 'Insertion Sort', 'Selection Sort', 'Merge Sort', 
    'Quick Sort', 'Counting Sort', 'Radix Sort', 'Bitwise Radix Sort', 'Heap Sort', 'Shell Sort'
  ];

  const benchmarkJsAlgorithmNames = Object.keys(results);
  const hasIncrementalResults = incrementalTestArrayResults.some(res => Object.keys(res).length > 0);

  if (benchmarkJsAlgorithmNames.length === 0 && !hasIncrementalResults) {
    console.log("No results found to plot.");
    return;
  }

  const lineStyles = [
    { color: '#FF6384', dash: undefined }, { color: '#36A2EB', dash: [5, 5] },
    { color: '#FFCE56', dash: undefined }, { color: '#4BC0C0', dash: [3, 3] },
    { color: '#9966FF', dash: undefined }, { color: '#FF9F40', dash: [7, 3] },
    { color: '#FF2400', dash: undefined }, { color: '#7986CB', dash: [4, 4] },
    { color: '#4CAF50', dash: [10, 4, 3, 4] }, { color: '#E57373', dash: undefined },
    { color: '#008080', dash: [4, 4] },
  ];

  // --- Chart 1 & 2: Benchmark.js Data ---
  let performanceChartConfigJs = 'null';
  let speedupChartConfigJs = 'null';

  if (benchmarkJsAlgorithmNames.length > 0) {
    // Chart 1: Performance
    const performanceDatasets = benchmarkJsAlgorithmNames.map((algoName, i) => {
      const dataPoints = results[algoName].sort((a, b) => a.size - b.size).map(r => ({ x: r.size, y: r.hz }));
      const style = lineStyles[i % lineStyles.length];
      return { label: algoName, data: dataPoints, borderColor: style.color, backgroundColor: style.color + '33', borderWidth: 2.5, pointRadius: 4, pointHoverRadius: 6, tension: 0.1, fill: false, borderDash: style.dash };
    });

    const performanceChartConfig = {
      type: 'line',
      data: { datasets: performanceDatasets },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Algorithm Performance (Ops/sec) - Higher is Better' },
          tooltip: {
            callbacks: {
              title: (items: any[]) => items.length > 0 ? `Array Size: ${items[0].raw.x}` : '',
              label: (item: any) => `${item.dataset.label || ''}: ${item.raw.y.toPrecision(4)} ops/sec`
            }
          }
        },
        scales: {
          x: { type: 'logarithmic', display: true, title: { display: true, text: 'Array Size (Log Scale)' } },
          y: {
            type: 'logarithmic',
            display: true,
            title: { display: true, text: 'Operations per Second (Log Scale)' },
            ticks: {
              callback: (val: any) => {
                if (typeof val !== 'number') return val;
                const abs = Math.abs(val);
                if (abs >= 1e6) return (val / 1e6).toPrecision(3) + 'M';
                if (abs >= 1e3) return (val / 1e3).toPrecision(3) + 'K';
                return val.toPrecision(3);
              }
            }
          }
        }
      }
    };
    performanceChartConfigJs = JSON.stringify(performanceChartConfig);

    // Chart 2: Speedup
    if (benchmarkJsAlgorithmNames.length > 1) {
      const sortedNames = [...benchmarkJsAlgorithmNames].sort((a, b) => (results[a][results[a].length - 1]?.hz ?? 0) - (results[b][results[b].length - 1]?.hz ?? 0));
      const baselineName = sortedNames[0];
      const baselineData = results[baselineName].sort((a, b) => a.size - b.size).map(r => ({ x: r.size, y: r.hz }));
      const speedupDatasets = sortedNames.filter(name => name !== baselineName).map((algoName, i) => {
        const currentData = results[algoName].sort((a, b) => a.size - b.size).map(r => ({ x: r.size, y: r.hz }));
        const ratioData = baselineData.map(bp => {
          const cp = currentData.find(p => p.x === bp.x);
          return (cp && cp.y && bp.y) ? { x: bp.x, y: cp.y / bp.y } : null;
        }).filter(p => p !== null);
        const style = lineStyles[i % lineStyles.length];
        return { label: `${algoName} / ${baselineName}`, data: ratioData, borderColor: style.color, backgroundColor: style.color + '33', borderWidth: 2, pointRadius: 4, pointHoverRadius: 6, tension: 0.1, fill: false, borderDash: style.dash };
      });
        
      const speedupChartOptions = {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: `Speedup Ratio (Relative to ${baselineName})` },
          tooltip: {
            callbacks: {
              title: (items: any[]) => items.length > 0 ? `Array Size: ${items[0].raw.x}` : '',
              label: (item: any) => `${item.dataset.label || ''}: ${item.raw.y.toPrecision(4)}x`
            }
          },
          annotation: {
            annotations: {
              baselineLine: { type: 'line', yMin: 1.0, yMax: 1.0, borderColor: 'rgba(128,128,128,0.7)', borderWidth: 2, borderDash: [6, 6], label: { content: '1.0x Baseline', enabled: true, position: 'end', backgroundColor: 'rgba(255,255,255,0.6)', color: 'rgba(100,100,100,1)', font: { style: 'italic' }, yAdjust: -10 } }
            }
          }
        },
        scales: {
          x: { type: 'logarithmic', display: true, title: { display: true, text: 'Array Size (Log Scale)' } },
          y: { type: 'logarithmic', display: true, title: { display: true, text: 'Speedup Ratio (Log Scale)' }, ticks: { callback: (val: any) => typeof val === 'string' ? val : val.toString() + 'x' } }
        }
      };
      speedupChartConfigJs = JSON.stringify({ type: 'line', data: { datasets: speedupDatasets }, options: speedupChartOptions });
    }
  }

  // --- Chart 3: Incremental Test Data ---
  let incrementalChartConfigJs = 'null';
  if (hasIncrementalResults) {
    const incrementalDatasets = incrementalTestArrayResults.map((singleAlgoResults, j) => {
      const dataPoints = [];
      for (const i in singleAlgoResults) {
        if (Object.hasOwn(singleAlgoResults, i)) {
          const time = singleAlgoResults[i];
          if (time > 0) dataPoints.push({ x: Number(i), y: time });
        }
      }
      const style = lineStyles[j % lineStyles.length];
      return { label: algorithmFunctionNames[j], data: dataPoints, borderColor: style.color, backgroundColor: style.color + '33', borderWidth: 2.5, pointRadius: 1, pointHoverRadius: 4, tension: 0.2, fill: false, borderDash: style.dash, };
    });

    const incrementalChartConfig = {
      type: 'line',
      data: { datasets: incrementalDatasets },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Incremental Test: Raw Execution Time (Log-Log Scale) - Lower is Better' },
          tooltip: {
            callbacks: {
              title: (items: any[]) => items.length > 0 ? `Array Size: ${items[0].raw.x}` : '',
              label: (item: any) => `${item.dataset.label || ''}: ${item.raw.y.toPrecision(4)} ms`
            }
          }
        },
        scales: {
          x: { type: 'logarithmic', display: true, title: { display: true, text: 'Array Size (Log Scale)' } },
          y: { type: 'logarithmic', display: true, title: { display: true, text: 'Execution Time (ms) (Log Scale)' } }
        }
      }
    };
    incrementalChartConfigJs = JSON.stringify(incrementalChartConfig);
  }

  // --- Generate HTML Content ---
  const htmlContent = `
<!DOCTYPE html><html><head><title>Benchmark Results</title><script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-annotation/3.0.1/chartjs-plugin-annotation.min.js"></script><style>body{font-family:sans-serif;margin:0;padding:20px;background-color:#f4f4f4;display:flex;flex-direction:column;align-items:center}.chart-container{width:90%;max-width:1000px;margin:20px auto;padding:20px;background-color:white;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.1)}h1,h2{text-align:center;color:#333}h1{margin-bottom:30px}</style></head><body><h1>Benchmark Analysis</h1>
${benchmarkJsAlgorithmNames.length > 0 ? `<div class="chart-container"><h2>Algorithm Performance (Ops/sec)</h2><canvas id="performanceChart"></canvas></div>` : ''}
${benchmarkJsAlgorithmNames.length > 1 ? `<div class="chart-container"><h2>Speedup Ratio Analysis</h2><canvas id="speedupChart"></canvas></div>` : ''}
${hasIncrementalResults ? `<div class="chart-container"><h2>Incremental Test: Raw Execution Time</h2><canvas id="incrementalTestChart"></canvas></div>` : ''}
<script>
if(window.ChartAnnotation){Chart.register(window.ChartAnnotation);}else{console.warn('Chart.js Annotation plugin not loaded.');}
if(${benchmarkJsAlgorithmNames.length > 0}){const perfCtx=document.getElementById('performanceChart').getContext('2d');new Chart(perfCtx,${performanceChartConfigJs});}
if(${benchmarkJsAlgorithmNames.length > 1}){const speedupCtx=document.getElementById('speedupChart').getContext('2d');new Chart(speedupCtx,${speedupChartConfigJs});}
if(${hasIncrementalResults}){const incrementalCtx=document.getElementById('incrementalTestChart').getContext('2d');new Chart(incrementalCtx,${incrementalChartConfigJs});}
</script></body></html>`;

  const plotFilePath = path.join(__dirname, "benchmark_plot.html");
  try {
    fs.writeFileSync(plotFilePath, htmlContent);
    console.log(`\n📊 Plots generated: ${plotFilePath}`);
    console.log("   Open this file in your web browser to view the charts.");
  } catch (err) {
    console.error("Error writing plot file:", err);
  }
}

//
// 5) Kick off the chain at index = 0
//
// To run BOTH tests: uncomment the runSuiteForSize(0) call. The script will run the incremental test first,
// then the benchmark.js suite, and finally generate all three plots.
//
// To run ONLY the incremental test: keep runSuiteForSize(0) commented out and uncomment the generatePlots call.
//

// Run the incremental test first
let totalIncrementalTestBeginTime = performance.now();
runIncrementalArraySizedTests();
let totalIncrementalTestTime = performance.now() - totalIncrementalTestBeginTime;
console.log(`Total Incremental Test Time = ${totalIncrementalTestTime / 1000} Seconds.`);


// Then run the benchmark.js tests (optional)
console.log("\nStarting Benchmark.js suite...");
runSuiteForSize(0); 

// If you only wanted to run the incremental test and plot its results,
// you would comment out the line above and uncomment the line below.
generatePlots(allBenchmarkResults);