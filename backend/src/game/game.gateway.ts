import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
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

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer()
  server: Server;

  private roomPatterns: Record<string, number[]> = {}; // pattern per room
  private roomGridSize: Record<string, number> = {}; // grid size per room
  // track ready players per room
  private roomReady: Record<string, Set<string>> = {}; // roomId -> set of playerIds

  private matchmakingQueue: string[] = []; // socket.id[]
  private roomCounter = 1;
  private PLAYERS_PER_ROOM = 2; // change later (2, 4, etc)

  // Store player usernames: playerId -> username
  private playerUsernames: Record<string, string> = {};

  constructor(
    private readonly gameService: GameService,
    private readonly leaderboardService: LeaderboardService,
  ) {}

  // Player sets their username
  @SubscribeMessage('player:setUsername')
  handleSetUsername(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SetUsernameDto,
  ) {
    const { playerId, username } = data;
    this.playerUsernames[playerId] = username;
    console.log(`Player ${playerId} set username: ${username}`);

    // Acknowledge username set
    client.emit('player:usernameSet', { playerId, username });
  }

  // Player joins a room
  @SubscribeMessage('room:join')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    void client.join(roomId);
    console.log(`Player joined room ${roomId}`);
    // Send acknowledgment
    client.emit('room:joined', { roomId });
  }

  // Start pattern for a room
  @SubscribeMessage('pattern:start')
  handleStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    const gridSize = 4; // default
    const pattern = this.gameService.generatePattern(gridSize);

    this.roomPatterns[roomId] = pattern;
    this.roomGridSize[roomId] = gridSize;

    // Reset leaderboard for this room
    this.leaderboardService.reset(roomId);

    // Broadcast pattern to all clients in this room
    this.server.to(roomId).emit('pattern:start', { pattern, gridSize });

    // Broadcast initial leaderboard
    this.server
      .to(roomId)
      .emit(
        'leaderboard:update',
        this.leaderboardService.getLeaderboard(roomId),
      );
  }

  // Handle player submission
  @SubscribeMessage('player:submit')
  handleSubmit(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: PlayerSubmitDto,
  ) {
    const { playerId, input, timeMs, roomId } = data;
    const pattern = this.roomPatterns[roomId];
    if (!pattern) return;

    const { correct, wrong } = this.gameService.evaluatePattern(pattern, input);
    const score = this.gameService.calculateScore(correct, wrong, timeMs);

    // Get username for this player
    const username = this.playerUsernames[playerId] || playerId;
    console.log(`Player ${playerId} submitting with username: ${username}`);
    console.log('All stored usernames:', this.playerUsernames);

    // First, update leaderboard with this player's score and username
    this.leaderboardService.addOrUpdateScore(
      playerId,
      score,
      roomId,
      username,
      timeMs,
    );

    // Broadcast updated leaderboard to this room
    const leaderboard = this.leaderboardService.getLeaderboard(roomId);
    console.log('Broadcasting leaderboard:', leaderboard);
    this.server.to(roomId).emit('leaderboard:update', leaderboard);

    // Send score to submitting player
    client.emit('player:score', { score, correct, wrong });

    // Now check if all players submitted
    const clientsInRoom =
      this.server.sockets.adapter.rooms.get(roomId) || new Set();
    const submittedPlayers = leaderboard.map((p) => p.playerId);

    if (submittedPlayers.length === clientsInRoom.size) {
      // All players submitted → round complete
      this.server.to(roomId).emit('round:complete');
    }
  }

  // Player signals they are ready
  @SubscribeMessage('player:ready')
  handlePlayerReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { playerId: string; roomId: string },
  ) {
    const { playerId, roomId } = data;

    if (!this.roomReady[roomId]) this.roomReady[roomId] = new Set();
    this.roomReady[roomId].add(playerId);

    // Broadcast updated ready status to room
    this.server.to(roomId).emit('room:readyUpdate', {
      readyPlayers: Array.from(this.roomReady[roomId]),
    });

    // Check if all connected clients in the room are ready
    const clientsInRoom =
      this.server.sockets.adapter.rooms.get(roomId) || new Set();
    if (this.roomReady[roomId].size === clientsInRoom.size) {
      // All players ready → start countdown
      this.startCountdown(roomId);
    }
  }

  // Countdown function
  private startCountdown(roomId: string) {
    let count = 3;
    const interval = setInterval(() => {
      this.server.to(roomId).emit('room:countdown', { count });
      count--;
      if (count < 0) {
        clearInterval(interval);
        // Start the pattern once countdown ends
        this.handleStartForRoom(roomId);
      }
    }, 1000);
  }

  // Start pattern for a room (internal)
  private handleStartForRoom(roomId: string) {
    const gridSize = 4;
    const pattern = this.gameService.generatePattern(gridSize);
    this.roomPatterns[roomId] = pattern;
    this.roomGridSize[roomId] = gridSize;

    this.leaderboardService.reset(roomId);
    this.server.to(roomId).emit('pattern:start', { pattern, gridSize });
    this.server
      .to(roomId)
      .emit(
        'leaderboard:update',
        this.leaderboardService.getLeaderboard(roomId),
      );

    // Reset ready set for next round
    this.roomReady[roomId].clear();
  }

  // Player requests to play again for the room
  @SubscribeMessage('room:playAgain')
  handlePlayAgain(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    console.log(`Play Again requested in room ${roomId}`);

    // Notify all players in the room to reset
    this.server.to(roomId).emit('room:reset');

    // Reset leaderboard and ready set for the room
    this.leaderboardService.reset(roomId);
    if (!this.roomReady[roomId]) this.roomReady[roomId] = new Set();
  }

  @SubscribeMessage('matchmaking:join')
  handleMatchmakingJoin(@ConnectedSocket() client: Socket) {
    console.log(`Player ${client.id} joined matchmaking`);

    // Prevent duplicate entries
    if (this.matchmakingQueue.includes(client.id)) return;

    this.matchmakingQueue.push(client.id);

    // Enough players to form a room?
    if (this.matchmakingQueue.length >= this.PLAYERS_PER_ROOM) {
      const roomId = `room_${this.roomCounter++}`;
      const players = this.matchmakingQueue.splice(0, this.PLAYERS_PER_ROOM);

      players.forEach((socketId) => {
        const socket = this.server.sockets.sockets.get(socketId);
        if (socket) {
          socket.join(roomId);
          socket.emit('matchmaking:found', { roomId });
        }
      });

      console.log(`Room created: ${roomId} with players`, players);
    }
  }

  handleDisconnect(client: Socket) {
    this.matchmakingQueue = this.matchmakingQueue.filter(
      (id) => id !== client.id,
    );
  }
}
