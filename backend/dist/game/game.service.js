"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
let GameService = class GameService {
    generatePattern(gridSize) {
        return Array.from({ length: gridSize * gridSize }, () => Math.random() > 0.5 ? 1 : 0);
    }
    calculateScore(correct, wrong, timeTakenMs) {
        const baseScore = correct * 100;
        const penalty = wrong * 10;
        const timeInSeconds = timeTakenMs / 1000;
        const maxTimeBonus = 500;
        const pointsPerSecond = 5;
        const timeBonus = Math.max(0, maxTimeBonus - timeInSeconds * pointsPerSecond);
        const finalScore = Math.max(0, baseScore - penalty + timeBonus);
        return Math.round(finalScore);
    }
    evaluatePattern(pattern, userInput) {
        let correct = 0;
        let wrong = 0;
        for (let i = 0; i < pattern.length; i++) {
            if (userInput[i] === pattern[i])
                correct++;
            else
                wrong++;
        }
        return { correct, wrong };
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)()
], GameService);
//# sourceMappingURL=game.service.js.map