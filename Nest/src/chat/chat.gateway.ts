import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
	namespace: 'chat',
	cors: {
		origin : '*',
}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly chatservice: ChatService) {}

	@WebSocketServer()
	server: Server;


	afterInit() {
		console.log('WebSocket Gateway initialized');
	}

	async handleConnection(@ConnectedSocket() client: Socket) {
		console.log('New connection');
    // console.log('Client', client);
		await this.chatservice.handleconnection(client);
		this.server.to(client.id).emit("message", {status: "ok", data: "subed"});
	}

	handleDisconnect(@ConnectedSocket() client: Socket) {
		this.chatservice.handledisconnect(client);
		console.log('Disconnected');
	}

	@SubscribeMessage('channel')
	async handleChannel(@ConnectedSocket() client: Socket, @MessageBody() body: string ) {
		console.log("channelGateway");
		const dto = JSON.parse(body)
		const [roomId, message] = await this.chatservice.handlechannel(dto.event, client, dto);
		this.server.to(roomId).emit("channel", message);
	}

	@SubscribeMessage('message')
	async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() body : string ) {
		console.log("messageGatway");
		const dto = JSON.parse(body)
		let status = "";
		if (dto.content && dto.id)
			status = "MODIFY";
		else if(!dto.content && dto.id )
			status = "DELETE";
		else if (dto.content && dto.channel_name)
			status = "CREATE";
		const [roomId, message] = await this.chatservice.messageEvent(client, dto);
		client.join(roomId);
		this.server.to(roomId).emit("message", {status: status, data: message});
	}

	@SubscribeMessage('event')
	async handleEvent(@ConnectedSocket() client: Socket, @MessageBody() dto : string) {
		const dtoParsed = JSON.parse(dto);
		const [status, roomId, message] = await this.chatservice.handleEvent(client, dtoParsed);
		client.join(roomId);
		this.server.to(roomId).emit("event", {status: status, data: message});
	}
	
}
