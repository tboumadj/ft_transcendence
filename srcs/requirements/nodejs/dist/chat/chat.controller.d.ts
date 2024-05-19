import { ChatService } from './chat.service';
import { Request, Response } from 'express';
import { ChannelNameDto } from './dto/chat.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    messagesChannel(dto: ChannelNameDto, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    usersChannel(dto: ChannelNameDto, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
}
