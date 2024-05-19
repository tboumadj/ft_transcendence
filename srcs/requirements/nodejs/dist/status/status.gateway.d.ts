import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { StatusService } from './status.service';
export declare class StatusGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly statusService;
    constructor(statusService: StatusService);
    server: Server;
    afterInit(): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    setOnLine(client: Socket): Promise<void>;
    setOffLine(client: Socket): Promise<void>;
    setInGame(client: Socket): Promise<void>;
    setInChat(client: Socket): Promise<void>;
}
