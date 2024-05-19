import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatservice;
    constructor(chatservice: ChatService);
    server: Server;
    afterInit(): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleChannel(client: Socket, body: string): Promise<void>;
    handleMessage(client: Socket, body: string): Promise<void>;
    handleEvent(client: Socket, dto: string): Promise<void>;
}
