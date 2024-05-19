import { Module } from '@nestjs/common';
import { Game } from './entity/game.entity';
//import { TypeOrmModule } from '@nestjs/typeorm';
import GameGateway from './game.gateway';
import { GameService } from './game.service';
//import { GameAuthGuard } from "../auth/jwt.strategy";
//import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from "../users/prisma.service";
//import { UserModule } from 'src/user/user.module';
import { GameController } from './game.controller';
import { AuthMiddleware } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from 'src/auth/auth.service';
import { TwofMiddleware } from 'src/auth/twof-auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers:[GameController],
	providers: [GameGateway, GameService, PrismaService, TwofMiddleware, ConfigService, AuthService, AuthMiddleware, JwtStrategy, JwtService],
	exports: [GameGateway, GameService],
  imports: [AuthModule],
})

export class GameModule {}
