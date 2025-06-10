/**
 * @file plotGenerator.ts
 * @description
 * This script serves as the "presentation layer" for the benchmark results.
 * Its responsibility is to read the raw data from the `performance-results.json` file
 * and transform it into a user-friendly HTML report containing interactive charts.
 *
 * It generates two types of charts for each scenario, ordered sequentially:
 * 1. Raw Performance: Shows the absolute execution time for each algorithm.
 * 2. Speedup Ratio: Shows the performance of each algorithm relative to the median.
 */

import * as fs from 'fs';
import * as path from 'path';

// Expected data structure from the JSON results file.
interface PerformanceResult {
    algorithmName: string;
    scenarioName: string;
    arraySize: number;
    executionTime: number;
}

// Transformed data structure, optimized for chart plotting.
type ProcessedData = {
    [scenarioName: string]: {
        [algorithmName: string]: { x: number; y: number }[];
    };
};

// Type for chart configuration objects.
type ChartConfigInfo = { chartId: string; chartConfig: string; chartTitle: string };

/**
 * Manages loading, processing, and rendering benchmark data into an HTML report.
 */
class PlotGenerator {
    private readonly results: PerformanceResult[];
    private processedData: ProcessedData = {};
    // A palette of colors for chart lines/areas.
    private readonly COLORS = ['#36A2EB', '#FF6384', '#4BC0C0', '#FF9F40', '#9966FF', '#FFCE56', '#C9CBCF', '#E57373', '#7986CB', '#008080', '#FF2400', '#FBC02D', '#3F51B5'];

    constructor(private readonly inputPath: string) {
        this.results = this.loadData();
    }

    /**
     * Generates the final HTML report with interleaved charts.
     * @param outputPath The file path where the HTML report should be saved.
     */
    public generateReport(outputPath: string): void {
        console.log('Processing benchmark data...');
        this.processData();

        console.log('Generating interleaved chart configurations...');
        const allCharts: ChartConfigInfo[] = [];
        let scenarioIndex = 0;

        // Iterate through each test scenario (e.g., 'Random', 'Sorted', 'Reverse Sorted')
        for (const [scenarioName, algorithms] of Object.entries(this.processedData)) {

            // 1. Generate Raw Performance Chart for the current scenario.
            const perfDatasets = Object.entries(algorithms).map(([algorithmName, data], algIndex) => ({
                label: algorithmName,
                data: data,
                borderColor: this.COLORS[algIndex % this.COLORS.length],
                backgroundColor: this.COLORS[algIndex % this.COLORS.length] + '33',
                tension: 0.1, borderWidth: 2, pointRadius: 3, pointHoverRadius: 5,
            }));

            const perfChartConfig = {
                type: 'line',
                data: { datasets: perfDatasets },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' as const },
                        title: { display: true, text: 'Raw Execution Time', font: { size: 18 } },
                        tooltip: { callbacks: { title: (items: any[]) => `Array Size: ${items[0].raw.x.toLocaleString()}`, label: (item: any) => `${item.dataset.label}: ${item.raw.y.toFixed(4)} ms` } }
                    },
                    scales: {
                        x: { type: 'logarithmic' as const, title: { display: true, text: 'Array Size (Logarithmic Scale)' } },
                        y: { type: 'logarithmic' as const, title: { display: true, text: 'Execution Time in ms (Logarithmic Scale)' } }
                    }
                }
            };

            allCharts.push({
                chartId: `perf-chart-${scenarioIndex}`,
                chartConfig: JSON.stringify(perfChartConfig).replace(/<\/script/g, '<\\/script'), // Prevent script tag breaking
                chartTitle: `Raw Performance: ${scenarioName}`
            });

            // 2. Generate Speedup Ratio Chart for the same scenario.
            // First, calculate median performance for each array size.
            const sizes = [...new Set(Object.values(algorithms).flatMap(data => data.map(d => d.x)))].sort((a, b) => a - b);
            const medianData = new Map<number, number>();

            for (const size of sizes) {
                const timesAtThisSize = Object.values(algorithms)
                    .map(data => data.find(d => d.x === size)?.y)
                    .filter((t): t is number => t !== undefined && t > 0);
                if (timesAtThisSize.length === 0) continue;

                timesAtThisSize.sort((a, b) => a - b);
                const mid = Math.floor(timesAtThisSize.length / 2);
                const median = timesAtThisSize.length % 2 !== 0 ? timesAtThisSize[mid] : (timesAtThisSize[mid - 1] + timesAtThisSize[mid]) / 2;
                medianData.set(size, median);
            }

            // Create datasets showing speedup relative to the median.
            const speedupDatasets = Object.entries(algorithms).map(([algorithmName, data], algIndex) => {
                const ratioData = data.map(point => ({ x: point.x, y: medianData.has(point.x) && point.y > 0 ? (medianData.get(point.x)! / point.y) : 0 }));
                return {
                    label: algorithmName,
                    data: ratioData,
                    borderColor: this.COLORS[algIndex % this.COLORS.length],
                    backgroundColor: this.COLORS[algIndex % this.COLORS.length] + '33',
                    tension: 0.1, borderWidth: 2, pointRadius: 3, pointHoverRadius: 5,
                };
            });

            const speedupChartConfig = {
                type: 'line',
                data: { datasets: speedupDatasets },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' as const },
                        title: { display: true, text: 'Speedup Ratio vs. Median Performance', font: { size: 18 } },
                        tooltip: { callbacks: { title: (items: any[]) => `Array Size: ${items[0].raw.x.toLocaleString()}`, label: (item: any) => `${item.dataset.label}: ${item.raw.y.toFixed(2)}x vs median` } },
                        annotation: { annotations: { baseline: { type: 'line' as const, yMin: 1.0, yMax: 1.0, borderColor: 'rgba(128, 128, 128, 0.7)', borderWidth: 2, borderDash: [6, 6], label: { content: 'Median Performance (1.0x)', enabled: true, position: 'end' as const, backgroundColor: 'rgba(255, 255, 255, 0.6)', color: 'rgba(100, 100, 100, 1)' } } } }
                    },
                    scales: {
                        x: { type: 'logarithmic' as const, title: { display: true, text: 'Array Size (Logarithmic Scale)' } },
                        y: { type: 'logarithmic' as const, title: { display: true, text: 'Speedup Ratio (Logarithmic Scale)' }, ticks: { callback: (val: any) => val.toString() + 'x' } }
                    }
                }
            };

            allCharts.push({
                chartId: `speedup-chart-${scenarioIndex}`,
                chartConfig: JSON.stringify(speedupChartConfig).replace(/<\/script/g, '<\\/script'),
                chartTitle: `Speedup Analysis: ${scenarioName}`
            });

            scenarioIndex++;
        }

        console.log('Generating HTML report...');
        const htmlContent = this.generateHtml(allCharts);

        this.saveReport(htmlContent, outputPath);
    }

    /**
     * Loads raw performance data from the specified JSON file.
     * Handles file reading and JSON parsing errors.
     */
    private loadData(): PerformanceResult[] {
        try {
            const rawData = fs.readFileSync(this.inputPath, 'utf-8');
            return JSON.parse(rawData) as PerformanceResult[];
        } catch (error) {
            console.error(`Error: Could not read or parse input file at ${this.inputPath}.`);
            console.error('Please ensure `performance-tester.ts` has been run successfully first.');
            process.exit(1);
        }
    }

    /**
     * Transforms raw results into a nested structure suitable for plotting.
     * Organizes data by scenario and algorithm, then sorts by array size.
     */
    private processData(): void {
        for (const result of this.results) {
            // Initialize nested objects if they don't exist
            if (!this.processedData[result.scenarioName]) { this.processedData[result.scenarioName] = {}; }
            const scenario = this.processedData[result.scenarioName];
            if (!scenario[result.algorithmName]) { scenario[result.algorithmName] = []; }
            // Add data point {x: arraySize, y: executionTime}
            scenario[result.algorithmName].push({ x: result.arraySize, y: result.executionTime });
        }
        // Sort data points by array size (x-value) for each algorithm within each scenario.
        for (const scenario of Object.values(this.processedData)) {
            for (const algorithmData of Object.values(scenario)) {
                algorithmData.sort((a, b) => a.x - b.x);
            }
        }
    }

    /**
     * Generates the full HTML content for the report.
     * Includes Chart.js and annotation plugin imports, styling, and dynamic chart scripts.
     * @param chartConfigs An array of chart configuration objects.
     * @returns The complete HTML string.
     */
    private generateHtml(chartConfigs: ChartConfigInfo[]): string {
        // Create HTML div elements for each chart canvas.
        const chartDivs = chartConfigs.map(c => `<div class="chart-container"><h2>${c.chartTitle}</h2><canvas id="${c.chartId}"></canvas></div>`).join('\n');
        // Create JavaScript code to initialize each Chart.js instance.
        const chartScripts = chartConfigs.map(c => `new Chart(document.getElementById('${c.chartId}'), ${c.chartConfig});`).join('\n');

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sorting Algorithm Benchmark Results</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-annotation/3.0.1/chartjs-plugin-annotation.min.js"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa; color: #343a40; }
        h1 { text-align: center; color: #212529; margin-bottom: 30px; }
        h2 { text-align: center; color: #495057; margin-top: 50px; border-top: 1px solid #dee2e6; padding-top: 40px; }
        .chart-container { width: 90%; max-width: 1200px; margin: 20px auto; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    </style>
</head>
<body>
    <h1>Sorting Algorithm Benchmark Analysis</h1>
    ${chartDivs}
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Register Chart.js annotation plugin if available.
            if(window.ChartAnnotation) { Chart.register(window.ChartAnnotation); }
            ${chartScripts}
        });
    </script>
</body>
</html>`;
    }

    /**
     * Saves the generated HTML content to the specified output file.
     * Creates directories if they don't exist.
     * @param htmlContent The HTML string to save.
     * @param outputPath The file path for the output HTML report.
     */
    private saveReport(htmlContent: string, outputPath: string): void {
        try {
            const outputDir = path.dirname(outputPath);
            // Ensure the output directory exists.
            if (!fs.existsSync(outputDir)) { fs.mkdirSync(outputDir, { recursive: true }); }
            fs.writeFileSync(outputPath, htmlContent);
            console.log(`Report successfully generated! Open this file in your browser:\n${path.resolve(outputPath)}`);
        } catch (error) {
            console.error(`Error: Could not write the report to ${outputPath}.`, error);
            process.exit(1);
        }
    }
}

/**
 * Main function to execute the plot generation.
 * Sets up input and output paths and initiates the process.
 */
function main() {
    const reportsDir = path.join(__dirname, '../../reports');
    const inputPath = path.join(reportsDir, 'performance-results.json');
    const outputPath = path.join(reportsDir, 'benchmark_plot.html');

    const generator = new PlotGenerator(inputPath);
    generator.generateReport(outputPath);
}

main();