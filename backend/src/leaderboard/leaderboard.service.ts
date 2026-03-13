import { Injectable } from '@nestjs/common';

interface PlayerScore {
  playerId: string;
  username: string;
  score: number;
  timeMs: number;
}

@Injectable()
export class LeaderboardService {
  // Store leaderboard per room
  private leaderboards: Record<string, PlayerScore[]> = {};

  addOrUpdateScore(
    playerId: string,
    score: number,
    roomId: string,
    username?: string,
    timeMs?: number,
  ): void {
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
    } else {
      const newEntry = {
        playerId,
        username: displayUsername,
        score,
        timeMs: timeMs || 0,
      };
      console.log('Adding new entry:', newEntry);
      leaderboard.push(newEntry);
    }

    // Sort by score DESC, then by time ASC (faster = better)
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; // Higher score wins
      }
      return a.timeMs - b.timeMs; // If tied, faster time wins
    });

    console.log('Final leaderboard:', leaderboard);
  }

  getLeaderboard(roomId: string): PlayerScore[] {
    return this.leaderboards[roomId] || [];
  }

  reset(roomId: string): void {
    this.leaderboards[roomId] = [];
  }
}
