import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';

@Module({
	controllers: [ChatController],
	providers: [ChatService, PrismaService, JwtService, ChatGateway],
	imports: [],
})
export class ChatModule {}
