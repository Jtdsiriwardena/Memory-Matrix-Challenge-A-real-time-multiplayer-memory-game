"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const game_service_1 = require("./game.service");
const leaderboard_service_1 = require("../leaderboard/leaderboard.service");
let GameGateway = class GameGateway {
    gameService;
    leaderboardService;
    server;
    roomPatterns = {};
    roomGridSize = {};
    roomReady = {};
    matchmakingQueue = [];
    roomCounter = 1;
    PLAYERS_PER_ROOM = 2;
    playerUsernames = {};
    constructor(gameService, leaderboardService) {
        this.gameService = gameService;
        this.leaderboardService = leaderboardService;
    }
    handleSetUsername(client, data) {
        const { playerId, username } = data;
        this.playerUsernames[playerId] = username;
        console.log(`Player ${playerId} set username: ${username}`);
        client.emit('player:usernameSet', { playerId, username });
    }
    handleJoinRoom(client, roomId) {
        void client.join(roomId);
        console.log(`Player joined room ${roomId}`);
        client.emit('room:joined', { roomId });
    }
    handleStart(client, roomId) {
        const gridSize = 4;
        const pattern = this.gameService.generatePattern(gridSize);
        this.roomPatterns[roomId] = pattern;
        this.roomGridSize[roomId] = gridSize;
        this.leaderboardService.reset(roomId);
        this.server.to(roomId).emit('pattern:start', { pattern, gridSize });
        this.server
            .to(roomId)
            .emit('leaderboard:update', this.leaderboardService.getLeaderboard(roomId));
    }
    handleSubmit(client, data) {
        const { playerId, input, timeMs, roomId } = data;
        const pattern = this.roomPatterns[roomId];
        if (!pattern)
            return;
        const { correct, wrong } = this.gameService.evaluatePattern(pattern, input);
        const score = this.gameService.calculateScore(correct, wrong, timeMs);
        const username = this.playerUsernames[playerId] || playerId;
        console.log(`Player ${playerId} submitting with username: ${username}`);
        console.log('All stored usernames:', this.playerUsernames);
        this.leaderboardService.addOrUpdateScore(playerId, score, roomId, username, timeMs);
        const leaderboard = this.leaderboardService.getLeaderboard(roomId);
        console.log('Broadcasting leaderboard:', leaderboard);
        this.server.to(roomId).emit('leaderboard:update', leaderboard);
        client.emit('player:score', { score, correct, wrong });
        const clientsInRoom = this.server.sockets.adapter.rooms.get(roomId) || new Set();
        const submittedPlayers = leaderboard.map((p) => p.playerId);
        if (submittedPlayers.length === clientsInRoom.size) {
            this.server.to(roomId).emit('round:complete');
        }
    }
    handlePlayerReady(client, data) {
        const { playerId, roomId } = data;
        if (!this.roomReady[roomId])
            this.roomReady[roomId] = new Set();
        this.roomReady[roomId].add(playerId);
        this.server.to(roomId).emit('room:readyUpdate', {
            readyPlayers: Array.from(this.roomReady[roomId]),
        });
        const clientsInRoom = this.server.sockets.adapter.rooms.get(roomId) || new Set();
        if (this.roomReady[roomId].size === clientsInRoom.size) {
            this.startCountdown(roomId);
        }
    }
    startCountdown(roomId) {
        let count = 3;
        const interval = setInterval(() => {
            this.server.to(roomId).emit('room:countdown', { count });
            count--;
            if (count < 0) {
                clearInterval(interval);
                this.handleStartForRoom(roomId);
            }
        }, 1000);
    }
    handleStartForRoom(roomId) {
        const gridSize = 4;
        const pattern = this.gameService.generatePattern(gridSize);
        this.roomPatterns[roomId] = pattern;
        this.roomGridSize[roomId] = gridSize;
        this.leaderboardService.reset(roomId);
        this.server.to(roomId).emit('pattern:start', { pattern, gridSize });
        this.server
            .to(roomId)
            .emit('leaderboard:update', this.leaderboardService.getLeaderboard(roomId));
        this.roomReady[roomId].clear();
    }
    handlePlayAgain(client, roomId) {
        console.log(`Play Again requested in room ${roomId}`);
        this.server.to(roomId).emit('room:reset');
        this.leaderboardService.reset(roomId);
        if (!this.roomReady[roomId])
            this.roomReady[roomId] = new Set();
    }
    handleMatchmakingJoin(client) {
        console.log(`Player ${client.id} joined matchmaking`);
        if (this.matchmakingQueue.includes(client.id))
            return;
        this.matchmakingQueue.push(client.id);
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
    handleDisconnect(client) {
        this.matchmakingQueue = this.matchmakingQueue.filter((id) => id !== client.id);
    }
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('player:setUsername'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleSetUsername", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('room:join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('pattern:start'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('player:submit'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleSubmit", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('player:ready'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handlePlayerReady", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('room:playAgain'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handlePlayAgain", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('matchmaking:join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleMatchmakingJoin", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [game_service_1.GameService,
        leaderboard_service_1.LeaderboardService])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map