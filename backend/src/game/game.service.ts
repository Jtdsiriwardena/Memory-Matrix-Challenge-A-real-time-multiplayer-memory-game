import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
  // Generate a random grid pattern
  generatePattern(gridSize: number): number[] {
    return Array.from({ length: gridSize * gridSize }, () =>
      Math.random() > 0.5 ? 1 : 0,
    );
  }

  // Calculate score based on correct/wrong selections and time taken
  calculateScore(correct: number, wrong: number, timeTakenMs: number): number {
    const baseScore = correct * 100;
    const penalty = wrong * 10;

    const timeInSeconds = timeTakenMs / 1000;
    const maxTimeBonus = 500;
    const pointsPerSecond = 5; // Deduct 5 points per second

    const timeBonus = Math.max(
      0,
      maxTimeBonus - timeInSeconds * pointsPerSecond,
    );

    const finalScore = Math.max(0, baseScore - penalty + timeBonus);

    return Math.round(finalScore);
  }

  // Compare user input to the correct pattern
  evaluatePattern(
    pattern: number[],
    userInput: number[],
  ): { correct: number; wrong: number } {
    let correct = 0;
    let wrong = 0;

    for (let i = 0; i < pattern.length; i++) {
      if (userInput[i] === pattern[i]) correct++;
      else wrong++;
    }

    return { correct, wrong };
  }
}
