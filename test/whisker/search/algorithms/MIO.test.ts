/*
 * Copyright (C) 2020 Whisker contributors
 *
 * This file is part of the Whisker test generator for Scratch.
 *
 * Whisker is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Whisker is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Whisker. If not, see http://www.gnu.org/licenses/.
 *
 */

import {BitstringChromosomeGenerator} from "../../../../src/whisker/bitstring/BitstringChromosomeGenerator";
import {SearchAlgorithmProperties} from "../../../../src/whisker/search/SearchAlgorithmProperties";
import {FitnessFunction} from "../../../../src/whisker/search/FitnessFunction";
import {BitstringChromosome} from "../../../../src/whisker/bitstring/BitstringChromosome";
import {SingleBitFitnessFunction} from "../../../../src/whisker/bitstring/SingleBitFitnessFunction";
import {List} from "../../../../src/whisker/utils/List";
import {MIO} from "../../../../src/whisker/search/algorithms/MIO";
import {FixedIterationsStoppingCondition} from "../../../../src/whisker/search/stoppingconditions/FixedIterationsStoppingCondition";
import {MIOBuilder} from "../../../../src/whisker/search/algorithms/MIOBuilder";
import {RankSelection} from "../../../../src/whisker/search/operators/RankSelection";

describe('MIO', () => {

    let searchAlgorithm;
    const iterations = 1000;

    beforeEach(() => {
        searchAlgorithm = new MIOBuilder().buildSearchAlgorithm();
    });

    test('Find optimal solution', () => {
        const solutions = searchAlgorithm.findSolution() as List<BitstringChromosome>;

        const fitnessFunctions = searchAlgorithm["_fitnessFunctions"];
        for (const fitnessFunction of fitnessFunctions.values()) {
            let optimal = false;
            for (const solution of solutions) {
                if (fitnessFunction.isOptimal(fitnessFunction.getFitness(solution))) {
                    optimal = true;
                    break;
                }
            }
            expect(optimal).toBeTruthy();
        }
    });

    test('Get current solution', () => {
        expect(searchAlgorithm.getCurrentSolution()).toBeUndefined();
        const solutions = searchAlgorithm.findSolution() as List<BitstringChromosome>;
        expect(searchAlgorithm.getCurrentSolution()).toEqual(solutions);
    });

    test('Get number of iterations', () => {
        expect(searchAlgorithm.getNumberOfIterations()).toBeUndefined();
        searchAlgorithm.findSolution();
        expect(searchAlgorithm.getNumberOfIterations()).toBe(iterations);
    });

    test('Setter', () => {
        const chromosomeLength = 10;
        const populationSize = 50;
        const iterations = 100;
        const crossoverProbability = 1;
        const mutationProbability = 1;

        const properties = new SearchAlgorithmProperties(populationSize, chromosomeLength, crossoverProbability, mutationProbability);
        const chromosomeGenerator = new BitstringChromosomeGenerator(properties);
        const stoppingCondition = new FixedIterationsStoppingCondition(iterations);
        const fitnessFunctions = new Map<number, FitnessFunction<BitstringChromosome>>();
        const heuristicFunctions = new Map<number, Function>();
        for (let i = 0; i < chromosomeLength; i++) {
            fitnessFunctions.set(i, new SingleBitFitnessFunction(chromosomeLength, i));
            heuristicFunctions.set(i, v => v / chromosomeLength);
        }

        const searchAlgo = new MIO();
        searchAlgo.setProperties(properties);
        expect(searchAlgo["_properties"]).toBe(properties);

        searchAlgo.setChromosomeGenerator(chromosomeGenerator);
        expect(searchAlgo["_chromosomeGenerator"]).toBe(chromosomeGenerator);

        searchAlgo.setStoppingCondition(stoppingCondition);
        expect(searchAlgo["_stoppingCondition"]).toBe(stoppingCondition);

        searchAlgo.setFitnessFunctions(fitnessFunctions);
        expect(searchAlgo["_fitnessFunctions"]).toBe(fitnessFunctions);

        const startOfFocusPhase = 0.4;
        searchAlgo.setStartOfFocusedPhase(startOfFocusPhase);
        expect(searchAlgo["_startOfFocusedPhase"]).toBe(startOfFocusPhase);

        searchAlgo.setHeuristicFunctions(heuristicFunctions);
        expect(searchAlgo["_heuristicFunctions"]).toBe(heuristicFunctions);

        const start = 0.4;
        const focusedPhase = 0.1;
        searchAlgo.setSelectionProbabilities(start, focusedPhase);
        expect(searchAlgo["_randomSelectionProbabilityStart"]).toBe(start);
        expect(searchAlgo["_randomSelectionProbabilityFocusedPhase"]).toBe(focusedPhase);

        searchAlgo.setArchiveSizes(start, focusedPhase);
        expect(searchAlgo["_maxArchiveSizeStart"]).toBe(start);
        expect(searchAlgo["_maxArchiveSizeFocusedPhase"]).toBe(focusedPhase);

        searchAlgo.setMutationCounter(start, focusedPhase);
        expect(searchAlgo["_maxMutationCountStart"]).toBe(start);
        expect(searchAlgo["_maxMutationCountFocusedPhase"]).toBe(focusedPhase);
    });

    test("Not supported setter", () => {
        const searchAlgorithm: MIO<BitstringChromosome> = new MIO();
        expect(function() {
            searchAlgorithm.setFitnessFunction(null);
        }).toThrow();

        expect(function() {
            searchAlgorithm.setSelectionOperator(null);
        }).toThrow();
    });
});