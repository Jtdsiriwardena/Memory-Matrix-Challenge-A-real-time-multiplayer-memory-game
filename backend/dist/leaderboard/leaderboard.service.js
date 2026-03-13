"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardService = void 0;
const common_1 = require("@nestjs/common");
let LeaderboardService = class LeaderboardService {
    leaderboards = {};
    addOrUpdateScore(playerId, score, roomId, username, timeMs) {
        console.log('LeaderboardService.addOrUpdateScore called with:', {
            playerId,
            score,
            roomId,
            username,
            timeMs,
        });
        if (!this.leaderboards[roomId]) {
            this.leaderboards[roomId] = [];
        }
        const leaderboard = this.leaderboards[roomId];
        const existingIndex = leaderboard.findIndex((e) => e.playerId === playerId);
        const displayUsername = username || playerId;
        console.log('Using displayUsername:', displayUsername);
        if (existingIndex !== -1) {
            leaderboard[existingIndex].score = score;
            leaderboard[existingIndex].username = displayUsername;
            leaderboard[existingIndex].timeMs = timeMs || 0;
        }
        else {
            const newEntry = {
                playerId,
                username: displayUsername,
                score,
                timeMs: timeMs || 0,
            };
            console.log('Adding new entry:', newEntry);
            leaderboard.push(newEntry);
        }
        leaderboard.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return a.timeMs - b.timeMs;
        });
        console.log('Final leaderboard:', leaderboard);
    }
    getLeaderboard(roomId) {
        return this.leaderboards[roomId] || [];
    }
    reset(roomId) {
        this.leaderboards[roomId] = [];
    }
};
exports.LeaderboardService = LeaderboardService;
exports.LeaderboardService = LeaderboardService = __decorate([
    (0, common_1.Injectable)()
], LeaderboardService);
//# sourceMappingURL=leaderboard.service.js.map