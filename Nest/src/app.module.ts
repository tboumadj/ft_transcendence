// import { Module } from '@nestjs/common';
// import { PrismaService } from './users/prisma.service';

// @Module({
//   providers: [PrismaService],
//   exports: [PrismaService],
// })
// export class PrismaModule {}

import { Module } from '@nestjs/common';
//import { AppController } from './app.controller';
//import { AppService } from './app.service';
import { PrismaModule } from './users/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { StatusModule } from './status/status.module';

@Module({
  imports: [PrismaModule, AuthModule, ChatModule, StatusModule, GameModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
