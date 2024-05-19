import { Controller, Get, Put, Post, Delete, Req, Res, Body, Param} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request, Response } from 'express';
import { ChannelDto, ChannelNameDto, IdDto, ChannelToUserDto, FullChannelDto } from './dto/chat.dto';

@Controller('/chat')
export class ChatController{
	constructor(private readonly chatService: ChatService) {}

	@Post('/messages')
	async messagesChannel(
		@Body() dto: ChannelNameDto,
		@Res() res: Response,
		@Req() req: Request) {
			return res.send(await this.chatService.messagesChannel(dto.channel_name, req));
	}

	@Post('/users')
	async usersChannel(
		@Body() dto: ChannelNameDto,
		@Res() res: Response,
		@Req() req: Request) {
			return res.send(await this.chatService.usersChannel(dto.channel_name, req));
	}
} 
