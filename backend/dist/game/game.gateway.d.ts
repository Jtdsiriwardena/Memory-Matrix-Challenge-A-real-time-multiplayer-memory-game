import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { LeaderboardService } from '../leaderboard/leaderboard.service';
interface PlayerSubmitDto {
    playerId: string;
    input: number[];
    timeMs: number;
    roomId: string;
}
interface SetUsernameDto {
    playerId: string;
    username: string;
}
export declare class GameGateway {
    private readonly gameService;
    private readonly leaderboardService;
    server: Server;
    private roomPatterns;
    private roomGridSize;
    private roomReady;
    private matchmakingQueue;
    private roomCounter;
    private PLAYERS_PER_ROOM;
    private playerUsernames;
    constructor(gameService: GameService, leaderboardService: LeaderboardService);
    handleSetUsername(client: Socket, data: SetUsernameDto): void;
    handleJoinRoom(client: Socket, roomId: string): void;
    handleStart(client: Socket, roomId: string): void;
    handleSubmit(client: Socket, data: PlayerSubmitDto): void;
    handlePlayerReady(client: Socket, data: {
        playerId: string;
        roomId: string;
    }): void;
    private startCountdown;
    private handleStartForRoom;
    handlePlayAgain(client: Socket, roomId: string): void;
    handleMatchmakingJoin(client: Socket): void;
    handleDisconnect(client: Socket): void;
}
export {};
