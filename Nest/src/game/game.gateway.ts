import {
	MessageBody,
	OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
	SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse
} from "@nestjs/websockets";
import { UserSocket } from "./entity/gamestate.entity";
import { Server, ServerOptions } from "socket.io";
import { GameService } from "./game.service";


@WebSocketGateway({
	cors:{
		origin:"*"
		//origin:process.env.C_URL

	},
	connectTimeout: 10000,
})
class GameGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private readonly gameService: GameService,
	) {}

	@WebSocketServer()
	server: Server;

	gameThread: NodeJS.Timeout

	afterInit(server: Server) {
		this.gameThread = setInterval(() => this.gameService.updateGames(server), 1000/20);
	}

	handleConnection(client: UserSocket, ...args: any[]) {
		this.gameService.connect(client);
	}

	handleDisconnect(client: UserSocket) {
		this.gameService.disconnect(this.server, client);
	}

	@SubscribeMessage('joinQueue')
	joinQueue(client: UserSocket, data: string): WsResponse {

		const success = this.gameService.joinQueue(client, this.server);
		return success
			? { event: 'joinQueueSuccess', data: '' }
			: { event: 'joinQueueError', data: '' };
	}

	@SubscribeMessage('privateQueue')
	 privateQueue(client: UserSocket, body: any):WsResponse {

		const my_body ={
			owner:body.owner,
			second:body.second,
			accept:body.accept,

		}
		const success = this.gameService.joinPrivateQueue(client, this.server, my_body);

    // await 

		return success
			? { event: 'joinPrivateQueueSuccess', data: '' }
			: { event: 'joinQueueError', data: '' };
	}

	@SubscribeMessage('leaveQueue')
	leaveQueue(client: UserSocket, data: string): WsResponse {
		const success = this.gameService.leaveQueue(client);
		return success
			? { event: 'leaveQueueSuccess', data: '' }
			: { event: 'leaveQueueError', data: '' };
	}

	@SubscribeMessage('abondonGame')
	abondonGame(client: UserSocket) {
		this.gameService.abondonGame(this.server, client);
	}

	@SubscribeMessage('startUp')
	paddleMoveUp(client: UserSocket) {
		this.gameService.shiftDirection(client, true, true);
	}

	@SubscribeMessage('startDown')
	paddleMoveDown(client: UserSocket) {
		this.gameService.shiftDirection(client, false, true);
	}

	@SubscribeMessage('stopUp')
	paddleStopUp(client: UserSocket) {
		this.gameService.shiftDirection(client, true, false);
	}

	@SubscribeMessage('stopDown')
	paddleStopDown(client: UserSocket) {
		this.gameService.shiftDirection(client, false, false);
	}
};

export default GameGateway;
