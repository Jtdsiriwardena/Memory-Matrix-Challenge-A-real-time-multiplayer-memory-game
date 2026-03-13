interface PlayerScore {
    playerId: string;
    username: string;
    score: number;
    timeMs: number;
}
export declare class LeaderboardService {
    private leaderboards;
    addOrUpdateScore(playerId: string, score: number, roomId: string, username?: string, timeMs?: number): void;
    getLeaderboard(roomId: string): PlayerScore[];
    reset(roomId: string): void;
}
export {};
