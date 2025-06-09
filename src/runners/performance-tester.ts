/**
 * @file performance-tester.ts
 * @description
 * This is the main executable script for running the performance benchmark suite.
 * It uses a BenchmarkRunner class to encapsulate the state and logic of the test run,
 * producing a `performance-results.json` file for analysis.
 * 
 * This runner includes two layers of dynamic protection:
 * 1. A hard time cap to prevent any single test from running too long.
 * 2. A dynamic trend detector to bail out of tests showing quadratic (O(n^2)) behavior.
 */

import { performance } from 'perf_hooks';
import * as fs from 'fs';
import * as path from 'path';
import { ALGORITHMS_TO_TEST, Algorithm } from '../config/algorithms.config';
import { PERFORMANCE_TEST_SIZES } from '../config/performance-test.config';
import { TestScenario } from '../config/test-scenarios.config';
import { getCompatibleScenariosFor } from '../config/scenario-helper';


// --- Refactoring 1: Consolidate Benchmark Configuration ---
// Grouping all tuning parameters into a single object makes them easier to manage.
const benchmarkConfig = {
    /** The absolute maximum time (in ms) a single benchmark is allowed to run. */
    MAX_EXECUTION_TIME_MS: 75,
    
    /** Factor used to detect quadratic growth. A value of 4 suggests that if size doubles, time quadruples. */
    QUADRATIC_BEHAVIOR_THRESHOLD: 4,
    
    /** The minimum execution time (in ms) required before trend detection will activate. */
    MIN_TIME_FOR_DETECTION_MS: 10,

    /**
     * Determines the number of samples to run based on the array size.
     * @param size The size of the array being tested.
     * @returns The number of samples to run.
     */
    getSampleSize: (size: number): number => {
        if (size < 50) return 100;
        if (size < 500) return 25;
        if (size < 5000) return 10;
        return 5;
    }
};

export interface PerformanceResult {
    algorithmName: string;
    scenarioName: string;
    arraySize: number;
    executionTime: number; 
}

class BenchmarkRunner {
    private readonly results: PerformanceResult[] = [];
    private totalStartTime: number = 0;
    private readonly previousResults: Map<string, { size: number; time: number }> = new Map();
    private readonly abandonedScenarios: Set<string> = new Set();

    public async run(): Promise<void> {
        this.logHeader();
        this.totalStartTime = performance.now();

        for (const algorithm of ALGORITHMS_TO_TEST) {
            this.runTestsForAlgorithm(algorithm);
        }

        this.logFooter();
        this.saveResults();
    }

    private runTestsForAlgorithm(algorithm: Algorithm): void {
        console.log(`\n--- Testing Algorithm: "${algorithm.name}" ---`);
        const compatibleScenarios = getCompatibleScenariosFor(algorithm);
        for (const scenario of compatibleScenarios) {
            this.runTestForScenario(algorithm, scenario);
        }
    }

    private runTestForScenario(algorithm: Algorithm, scenario: TestScenario): void {
        const scenarioKey = `${algorithm.name}|${scenario.name}`;
        console.log(`  - Scenario: "${scenario.name}"`);
        
        for (const size of PERFORMANCE_TEST_SIZES) {
            if (size === 0) continue;
            if (this.abandonedScenarios.has(scenarioKey)) break;

            // --- Refactoring 2: Extract the measurement logic ---
            // The main loop is now cleaner, focusing on orchestrating the test, not the details of it.
            const { averageTime, totalSampleTime, sampleSize } = this.measurePerformance(algorithm, scenario, size);
            
            console.log(`    - Size: ${size.toLocaleString().padEnd(8)}: ${averageTime.toFixed(4)} ms (avg of ${sampleSize} runs in ${totalSampleTime.toFixed(2)} ms)`);
            
            this.results.push({ algorithmName: algorithm.name, scenarioName: scenario.name, arraySize: size, executionTime: averageTime });

            // --- Refactoring 3: Encapsulate the bail-out logic ---
            // The decision to abandon a scenario is now its own clear, single-responsibility function.
            this.checkForBailOut(averageTime, size, scenarioKey);
            
            this.previousResults.set(scenarioKey, { size, time: averageTime });
        }
    }

    /**
     * Executes the benchmark for a single algorithm/scenario/size combination and returns the timing results.
     */
    private measurePerformance(algorithm: Algorithm, scenario: TestScenario, size: number) {
        const sampleSize = benchmarkConfig.getSampleSize(size);
        const masterArray = scenario.generator(size);
        const sampleTimes: number[] = [];

        for (let i = 0; i < sampleSize; i++) {
            const start = performance.now();
            algorithm.fn([...masterArray]);
            const end = performance.now();
            sampleTimes.push(end - start);
        }
        
        const totalSampleTime = sampleTimes.reduce((sum, time) => sum + time, 0);
        const averageTime = totalSampleTime / sampleTimes.length;

        return { averageTime, totalSampleTime, sampleSize };
    }

    /**
     * Checks if a scenario should be abandoned based on execution time or performance trend.
     */
    private checkForBailOut(averageTime: number, size: number, scenarioKey: string): void {
        // Layer 1: The Hard Cap Safety Net.
        if (averageTime > benchmarkConfig.MAX_EXECUTION_TIME_MS) {
            console.log(`      ↳ ❗ TIME CAP REACHED. Execution exceeded ${benchmarkConfig.MAX_EXECUTION_TIME_MS}ms. Abandoning scenario.`);
            this.abandonedScenarios.add(scenarioKey);
            return; // Exit early if the cap is reached
        }

        // Layer 2: The Trend Detector.
        const prevResult = this.previousResults.get(scenarioKey);
        if (prevResult && averageTime > benchmarkConfig.MIN_TIME_FOR_DETECTION_MS) {
            const sizeRatio = size / prevResult.size;
            const timeRatio = averageTime / prevResult.time;

            if (sizeRatio > 1 && timeRatio > 1) {
                const degradationRatio = timeRatio / sizeRatio;
                if (degradationRatio > benchmarkConfig.QUADRATIC_BEHAVIOR_THRESHOLD) {
                    console.log(`      ↳ ❗ DETECTED QUADRATIC BEHAVIOR. Abandoning scenario.`);
                    this.abandonedScenarios.add(scenarioKey);
                }
            }
        }
    }
    
    // (The saveResults, logHeader, and logFooter methods are unchanged)
    private saveResults(): void {
        const reportsDir = path.join(__dirname, '../../reports');
        if (!fs.existsSync(reportsDir)) { fs.mkdirSync(reportsDir, { recursive: true }); }
        const outputPath = path.join(reportsDir, 'performance-results.json');
        try {
            fs.writeFileSync(outputPath, JSON.stringify(this.results, null, 2));
            console.log(`\n✅ Results successfully saved to: ${path.relative(process.cwd(), outputPath)}`);
        } catch (error) {
            console.error(`\n❌ Failed to save results to file: ${outputPath}`, error);
        }
    }
    private logHeader(): void { console.log('================================================\n🚀 STARTING PERFORMANCE BENCHMARK SUITE 🚀\n================================================'); }
    private logFooter(): void {
        const totalDuration = (performance.now() - this.totalStartTime) / 1000;
        console.log('\n================================================\n🏁 BENCHMARK SUITE COMPLETE 🏁');
        console.log(`Total execution time: ${totalDuration.toFixed(2)} seconds.`);
    }
}


const runner = new BenchmarkRunner();
runner.run().catch(error => {
    console.error("A critical error occurred during the benchmark execution:", error);
});