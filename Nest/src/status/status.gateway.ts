import { SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { StatusService } from './status.service';

@WebSocketGateway({
  namespace: 'status',
  cors: {
    origin : '*',
  }})

export class StatusGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly statusService: StatusService) {}

  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('WebSocket Status Gateway initialized');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log('Status New connection');
    await this.statusService.handleconnection(client);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.statusService.handledisconnect(client);
    console.log('Status Disconnected');
  }

  @SubscribeMessage('onLine')
  async setOnLine(@ConnectedSocket() client: Socket) {
    await this.statusService.setOnLine(client);
  }

  @SubscribeMessage('offLine')
  async setOffLine(@ConnectedSocket() client: Socket) {
    await this.statusService.setOffLine(client);
  }

  @SubscribeMessage('inGame')
  async setInGame(@ConnectedSocket() client: Socket) {
    await this.statusService.setInGame(client);
  }

  @SubscribeMessage('inChat')
  async setInChat(@ConnectedSocket() client: Socket) {
    await this.statusService.setInChat(client);
  }

}
