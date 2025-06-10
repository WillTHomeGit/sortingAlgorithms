/**
 * @file scenario-helper.ts
 * @description
 * This file contains shared helper functions for filtering and managing test scenarios.
 * Its primary purpose is to decouple the runners (like correctness.test.ts) from the
 * raw configuration files. It centralizes the logic for determining which test scenarios
 * are compatible with a given algorithm based on its declared capabilities.
 *
 * By using this helper, we avoid duplicating filtering logic in multiple runners and
 * keep our configuration files as pure, declarative data structures.
 */

import { Algorithm } from './algorithms.config';
import { TestScenario, scenariosToTest } from './test-scenarios.config';

/**
 * Filters the master list of scenarios based on the capabilities of an algorithm.
 * This is the single source of truth for filtering logic.
 * @param algorithm The algorithm whose capabilities we are checking.
 * @returns A filtered array of compatible TestScenario objects.
 */
export function getCompatibleScenariosFor(algorithm: Algorithm): TestScenario[] {
    // Start with all scenarios
    let scenarios = scenariosToTest;

    // Rule 1: If the algorithm only accepts integers, filter out float scenarios.
    if (algorithm.accepts === 'integers') {
        scenarios = scenarios.filter(scenario => scenario.dataType === 'integer');
    }

    return scenarios;
}