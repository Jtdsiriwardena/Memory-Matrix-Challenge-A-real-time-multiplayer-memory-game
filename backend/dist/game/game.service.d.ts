export declare class GameService {
    generatePattern(gridSize: number): number[];
    calculateScore(correct: number, wrong: number, timeTakenMs: number): number;
    evaluatePattern(pattern: number[], userInput: number[]): {
        correct: number;
        wrong: number;
    };
}
