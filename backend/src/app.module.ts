// src/app.module.ts
import { Module } from '@nestjs/common';
import { GameGateway } from './game/game.gateway';
import { GameService } from './game/game.service';
import { LeaderboardService } from './leaderboard/leaderboard.service';

@Module({
  providers: [GameGateway, GameService, LeaderboardService],
})
export class AppModule {}
