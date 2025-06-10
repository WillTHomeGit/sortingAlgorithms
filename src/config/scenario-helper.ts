/**
 * @file scenario-helper.ts
 * @description
 * This file provides utility functions for filtering test scenarios based on algorithm compatibility.
 * It ensures that algorithms are only tested with data types they are designed to handle.
 */

import { Algorithm } from './algorithms.config';
import { TestScenario, scenariosToTest } from './test-scenarios.config';

/**
 * Filters the list of all available test scenarios to return only those compatible with a given algorithm.
 * For example, integer-only algorithms will only be tested with integer data scenarios.
 * @param algorithm - The algorithm for which to find compatible scenarios.
 * @returns An array of `TestScenario` objects compatible with the provided algorithm.
 */
export function getCompatibleScenariosFor(algorithm: Algorithm): TestScenario[] {
    let scenarios = scenariosToTest;

    // If the algorithm specifically accepts only integers, filter scenarios to match.
    if (algorithm.accepts === 'integers') {
        scenarios = scenarios.filter(scenario => scenario.dataType === 'integer');
    }

    return scenarios;
}