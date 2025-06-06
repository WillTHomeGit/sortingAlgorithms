// benchmarking.ts (or benchmarking.js with `"type": "module"` in package.json)

import { bubbleSort, bubbleSortSmart, insertionSort, selectionSort, mergeSort, quickSort, countingSort, radixSort, bitwiseRadixSort, heapSort, shellSort } from "./sortingAlgorithms"; // Assuming you have these
import Benchmark from "benchmark";
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

//
// 2) Pre-generate one random array for each size
//
console.log("Generating test arrays...");
const testArrays: number[][] = testNumbers.map((n) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * n * 2))
);
console.log("Test arrays generated.");

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
      // maxTime:2                                 //1283971283714
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
      // maxTime:2                               //1283971283714
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
  const algorithmNames = Object.keys(results);
  if (algorithmNames.length === 0) {
    console.log("No benchmark results to plot.");
    return;
  }

  // === Chart 1: Performance (Ops/sec) on Log-Log Scale ===
  const lineStyles = [
    { color: '#FF6384', dash: undefined },
    { color: '#36A2EB', dash: [5, 5] },
    { color: '#FFCE56', dash: undefined },
    { color: '#4BC0C0', dash: [3, 3] },
    { color: '#9966FF', dash: undefined },
    { color: '#FF9F40', dash: [7, 3] },
    { color: '#FF2400', dash: undefined },
    { color: '#7986CB', dash: [4, 4] },
    { color: '#4CAF50', dash: [10, 4, 3, 4] },
    { color: '#E57373', dash: undefined },
    { color: '#008080', dash: [4, 4] },
  ];

  const performanceDatasets = algorithmNames.map((algoName, i) => {
    const dataPoints = results[algoName]
      .sort((a, b) => a.size - b.size)
      .map(r => ({ x: r.size, y: r.hz }));

    const style = lineStyles[i % lineStyles.length];

    return {
      label: algoName,
      data: dataPoints,
      borderColor: style.color,
      backgroundColor: style.color + '33',
      borderWidth: 2.5,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.1,
      fill: false,
      borderDash: style.dash,
    };
  });

  const performanceChartConfig = {
    type: 'line',
    data: {
      datasets: performanceDatasets,
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Algorithm Performance (Log-Log Scale)' },
        tooltip: {
          callbacks: {
            title: function(tooltipItems: any[]) {
              if (tooltipItems.length > 0) {
                return `Array Size: ${tooltipItems[0].raw.x}`;
              }
              return '';
            },
            label: function(tooltipItem: any) {
              let label = tooltipItem.dataset.label || '';
              if (label) label += ': ';
              if (tooltipItem.raw.y !== null && tooltipItem.raw.y !== undefined) {
                label += `${tooltipItem.raw.y.toPrecision(4)} ops/sec`;
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'logarithmic',
          display: true,
          title: { display: true, text: 'Array Size (Log Scale)' },
        },
        y: {
          type: 'logarithmic',
          display: true,
          title: { display: true, text: 'Operations per Second (ops/sec) (Log Scale)' },
          ticks: {
            callback: function(value: number | string) {
              if (typeof value === 'string') return value;
              if (value === 0) return '0';
              const absValue = Math.abs(value);
              if (absValue >= 1e6) return (value / 1e6).toPrecision(3) + 'M';
              if (absValue >= 1e3) return (value / 1e3).toPrecision(3) + 'K';
              return value.toPrecision(3);
            }
          }
        },
      },
    },
  };

  // === Chart 2: Speedup Ratio (Optional - if more than one algorithm) ===
  let speedupChartConfigJs = 'null';
  if (algorithmNames.length > 1) {
    // --- IMPROVEMENT: Pick the slowest algorithm as the baseline for more intuitive ratios ---
    const sortedAlgorithmNames = [...algorithmNames].sort((a, b) => {
        const aLastResult = results[a][results[a].length - 1]?.hz ?? 0;
        const bLastResult = results[b][results[b].length - 1]?.hz ?? 0;
        return aLastResult - bLastResult; // Sorts ascending by speed (slowest first)
    });
    const baselineAlgoName = sortedAlgorithmNames[0]; // Slowest algorithm is the new baseline

    const baselineData = results[baselineAlgoName]
        .sort((a,b) => a.size - b.size)
        .map(r => ({ x: r.size, y: r.hz }));

    const speedupDatasets = sortedAlgorithmNames
      .filter(name => name !== baselineAlgoName) // Don't compare the baseline to itself
      .map((algoName, i) => {
      const currentAlgoData = results[algoName]
          .sort((a,b) => a.size - b.size)
          .map(r => ({x: r.size, y: r.hz}));

      const ratioDataPoints = baselineData.map(baselinePoint => {
        const currentPoint = currentAlgoData.find(p => p.x === baselinePoint.x);
        if (currentPoint && currentPoint.y !== null && currentPoint.y !== undefined &&
            baselinePoint.y !== null && baselinePoint.y !== undefined && baselinePoint.y !== 0) {
          return { x: baselinePoint.x, y: currentPoint.y / baselinePoint.y };
        }
        return { x: baselinePoint.x, y: null };
      }).filter(p => p.y !== null);

      const style = lineStyles[i % lineStyles.length];

      return {
        label: `${algoName} / ${baselineAlgoName}`,
        data: ratioDataPoints,
        borderColor: style.color,
        backgroundColor: style.color + '33',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.1,
        fill: false,
        borderDash: style.dash,
      };
    });

    const speedupChartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: `Speedup Ratio (Relative to ${baselineAlgoName})` },
        tooltip: {
          callbacks: {
            title: function(tooltipItems: any[]) {
               if (tooltipItems.length > 0) {
                   return `Array Size: ${tooltipItems[0].raw.x}`;
               }
               return '';
            },
            label: function(tooltipItem: any) {
                let label = tooltipItem.dataset.label || '';
                if (label) label += ': ';
                if (tooltipItem.raw.y !== null && tooltipItem.raw.y !== undefined) {
                    label += `${tooltipItem.raw.y.toPrecision(4)}x`;
                }
                return label;
            }
          }
        },
        annotation: { 
          annotations: {
            baselineLine: {
              type: 'line',
              yMin: 1.0,
              yMax: 1.0,
              borderColor: 'rgba(128, 128, 128, 0.7)',
              borderWidth: 2,
              borderDash: [6, 6], 
              label: {
                content: '1.0x Baseline',
                enabled: true,
                position: 'end',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                color: 'rgba(100, 100, 100, 1)',
                font: { style: 'italic' },
                yAdjust: -10,
              }
            }
          }
        }
      },
      scales: {
        x: {
          type: 'logarithmic',
          display: true,
          title: { display: true, text: 'Array Size (Log Scale)' },
        },
        // --- THIS IS THE REQUESTED CHANGE ---
        y: {
          type: 'logarithmic',
          display: true,
          title: { display: true, text: 'Speedup Ratio (Log Scale)' },
          ticks: {
            callback: function(value: number | string) {
              if (typeof value === 'string') return value;
              // Use toString() for clean log-scale numbers (e.g., 1, 10, 100)
              return value.toString() + 'x';
            }
          },
        },
      },
    };
    speedupChartConfigJs = JSON.stringify({ type: 'line', data: { datasets: speedupDatasets }, options: speedupChartOptions });
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Benchmark Results</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-annotation/3.0.1/chartjs-plugin-annotation.min.js"></script>
    <style>
        body { font-family: sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; display: flex; flex-direction: column; align-items: center; }
        .chart-container { 
            width: 90%; 
            max-width: 1000px; 
            margin: 20px auto; 
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1, h2 { text-align: center; color: #333; }
        h1 { margin-bottom: 30px; }
    </style>
</head>
<body>
    <h1>Benchmark Analysis</h1>

    <div class="chart-container">
        <h2>Algorithm Performance (Ops/sec)</h2>
        <canvas id="performanceChart"></canvas>
    </div>

    ${algorithmNames.length > 1 ? `
    <div class="chart-container">
        <h2>Speedup Ratio Analysis</h2>
        <canvas id="speedupChart"></canvas>
    </div>
    ` : ''}

    <script>
        // Register the annotation plugin
        if (window.ChartAnnotation) {
            Chart.register(window.ChartAnnotation);
        } else {
            console.warn('Chart.js Annotation plugin (ChartAnnotation) not loaded. Annotations will not be displayed.');
        }

        const perfCtx = document.getElementById('performanceChart').getContext('2d');
        new Chart(perfCtx, ${JSON.stringify(performanceChartConfig)});

        ${algorithmNames.length > 1 ? `
        const speedupChartCanvas = document.getElementById('speedupChart');
        if (speedupChartCanvas) {
            const speedupCtx = speedupChartCanvas.getContext('2d');
            const speedupConfig = ${speedupChartConfigJs};
            if (speedupConfig) {
              new Chart(speedupCtx, speedupConfig);
            }
        }
        ` : ''}
    </script>
</body>
</html>
`;

  const plotFilePath = path.join(__dirname, "benchmark_plot.html");
  try {
    fs.writeFileSync(plotFilePath, htmlContent);
    console.log(`\n📊 Plots generated: ${plotFilePath}`);
    console.log("   Open this file in your web browser to view the charts.");
  } catch (err) {
    console.error("Error writing plot file:", err);
  }
}

//
// 5) Kick off the chain at index = 0
//
console.log("Starting benchmarks...");
runSuiteForSize(0);