/// <reference types="node" />
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WsResponse } from "@nestjs/websockets";
import { UserSocket } from "./entity/gamestate.entity";
import { Server } from "socket.io";
import { GameService } from "./game.service";
declare class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly gameService;
    constructor(gameService: GameService);
    server: Server;
    gameThread: NodeJS.Timeout;
    afterInit(server: Server): void;
    handleConnection(client: UserSocket, ...args: any[]): void;
    handleDisconnect(client: UserSocket): void;
    joinQueue(client: UserSocket, data: string): WsResponse;
    privateQueue(client: UserSocket, body: any): WsResponse;
    leaveQueue(client: UserSocket, data: string): WsResponse;
    abondonGame(client: UserSocket): void;
    paddleMoveUp(client: UserSocket): void;
    paddleMoveDown(client: UserSocket): void;
    paddleStopUp(client: UserSocket): void;
    paddleStopDown(client: UserSocket): void;
}
export default GameGateway;
