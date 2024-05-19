import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../users/prisma.service";
import { Game } from "./entity/game.entity";
import { GameConstants, GameState, PlayerState, UserSocket } from "./entity/gamestate.entity";
import { Server } from "socket.io";
//import { UsersService } from "../users/users.service";
import { AuthMiddleware } from "./jwt-auth.guard";
import { Socket  } from "socket.io";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    //private readonly userService: UsersService,
    private readonly authGuard: AuthMiddleware,
  ) {}

	private activeGames: GameState[] = [];
	private sanitizeGameState(game: GameState): GameState {
		const sanitized = {...game};
		delete sanitized.player1_socket;
		delete sanitized.player2_socket;
		delete sanitized.player1_pressUp;
		delete sanitized.player2_pressUp;
		delete sanitized.player1_pressDown;
		delete sanitized.player2_pressDown;
		return sanitized;
	}

  async createGame(gameEntry: Game): Promise<Game> {
    const createdGame = await this.prisma.game.create({
      data: {
        p1: { connect: { id: gameEntry.p1.id } },
        p2: { connect: { id: gameEntry.p2.id } },
        scorP1: gameEntry.scorP1,
        scorP2: gameEntry.scorP2,
        playedOn: gameEntry.playedOn,
      },
    });


    const game: Game = {
      id: createdGame.id,
      p1: gameEntry.p1,
      p2: gameEntry.p2,
      scorP1: createdGame.scorP1,
      scorP2: createdGame.scorP2,
      playedOn: createdGame.playedOn,
    };
    
    return game;
  }

  async updateGameScore(game: Game, score1: number, score2: number): Promise<void> {
    await this.prisma.game.update({
      where: { id: game.id },
      data: { scorP1: score1, scorP2: score2 },
    });
  }

	updateGames(server: Server) {
		for (let game of this.activeGames) {
			let playSound = false;
			// Scoring Detect
			if (game.ballX >= GameConstants.LEFT
				&& game.ballVelX >= 0) {
				game.score1 += 1;
				game.ballVelX = -2;
			}
			else if (game.ballX <= GameConstants.RIGHT
				&& game.ballVelX <= 0) {
				game.score2 += 1;
				game.ballVelX = 2;
			}
			if (game.ballX <= GameConstants.RIGHT || game.ballX >= GameConstants.LEFT)
			{
				game.ballVelY = 0;
				game.ballX = 0;
				game.ballY = 0;
				game.paddle1 = 0;
				game.paddle2 = 0;
			}

			// Ending Trigger
			if ((game.score1 > 10 || game.score2 > 10)
				&& (Math.abs(game.score1 - game.score2) >= 2))
			{
				this.endGame(server, game);
				continue;
			}

			// Movements PADDLE
			if (game.player1_pressDown)
				game.paddle1 < GameConstants.TOP - (GameConstants.PADDLE_HEIGHT / 2) ? game.paddle1 += 2 : game.paddle1;
			if (game.player1_pressUp)
				game.paddle1 > GameConstants.BOTTOM + (GameConstants.PADDLE_HEIGHT / 2) ? game.paddle1 -= 2 : game.paddle1;

			if (game.player2_pressDown)
				game.paddle2 < GameConstants.TOP - (GameConstants.PADDLE_HEIGHT / 2) ? game.paddle2 += 2 : game.paddle2;
			if (game.player2_pressUp)
				game.paddle2 > GameConstants.BOTTOM + (GameConstants.PADDLE_HEIGHT / 2) ? game.paddle2 -= 2 : game.paddle2;

			// Ball Movements
			game.ballX += game.ballVelX;
			game.ballY += game.ballVelY;

			// Walls Collisions
			if ((game.ballY + (GameConstants.BALL_RADIUS / 2) >= GameConstants.TOP && game.ballVelY >= 0)
				|| (game.ballY - (GameConstants.BALL_RADIUS / 2) <= GameConstants.BOTTOM && game.ballVelY <= 0)) {
				game.ballVelY = -game.ballVelY;
				playSound = true;
			}

			// Paddles Collisions
			if ((game.ballX + (GameConstants.BALL_RADIUS / 2) >= GameConstants.LEFT - GameConstants.PADDLE_WIDTH
					&& game.ballY <= game.paddle2 + (GameConstants.PADDLE_HEIGHT / 2)
					&& game.ballY >= game.paddle2 - (GameConstants.PADDLE_HEIGHT / 2)
					&& game.ballVelX >= 0)
				|| ( game.ballX - (GameConstants.BALL_RADIUS / 2) <= GameConstants.RIGHT + GameConstants.PADDLE_WIDTH
					&& game.ballY <= game.paddle1 + (GameConstants.PADDLE_HEIGHT / 2)
					&& game.ballY >= game.paddle1 - (GameConstants.PADDLE_HEIGHT / 2)
					&& game.ballVelX <= 0)) {
				game.ballVelX = (-game.ballVelX) * 1.1;
				game.ballVelY = (Math.random() - 0.5) * 8;
				playSound = true;
			}

			// Sends Update
			const room_name = 'game_' + game.player1_socket + '_' + game.player2_socket;
			const sanitizedGame = this.sanitizeGameState(game);
			server.to(room_name).emit('gameUpdate', { ...sanitizedGame, playSound: playSound});
		}
	}

	async connect(client: UserSocket) {

		const user = await this.getUserSocket(client);
		//console.log("USER", user);

		if (!user) {
			console.log("NOT USER");
			client.disconnect(true);
			return;
		}

		client.data.state = PlayerState.NONE;
		client.data.game = undefined;
		client.data.user = user.id;
		const one = await this.prisma.findUserById(+client.data.user);
		one.inGame = true;
		this.prisma.updateUser(one.id,one);

		// console.log('New client connected', client.data);
	}

	async getUserSocket(client: Socket) {
    //console.log('ClienHand= ', client.handshake);
		const jwt = client.handshake.headers.cookies as string;
		const username = this.jwt.decode(jwt).sub;
		const user = await this.prisma.user.findUnique(({where: {id: username}}));
		if (!user)
		throw ('User not found');	
		return user;
	}

	async disconnect(server: Server, client: UserSocket) {
		if ( isNaN(+client.data.user) )
			return;
		for (let game of this.activeGames) {
			if (game.player1_socket == client.id) {
				game.score1 = -1;
				game.score2 = 11;
				this.endGame(server, game);
				break;
			}
			if (game.player2_socket == client.id) {
				game.score1 = 11;
				game.score2 = -1;
				this.endGame(server, game);
				break;
			}
		}
    //console.log('TEST= ', +client.data.user);
		const one = await this.prisma.findUserById(+client.data.user);
		// console.log("one",one)
		one.inGame = false;
		this.prisma.updateUser(one.id,one);	
		console.log('Client disconnected');
	}


	async startGame(server: Server, user_id:number) {
		const room = server.sockets.adapter.rooms.get('queue');
		if (room.size < 2)
		{
			// const one = await this.userService.findById(user_id);
			// one.haveInvitatio = true
			// this.userService.updateUser(one.id,one);		
			return;
		}

		let room_iter = room.values();
		let players: UserSocket[] = [undefined, undefined]

		for (let i = 0; i < 2; i++) {
			const target = server.sockets.sockets.get(room_iter.next().value) as UserSocket;
			target.data.state = PlayerState.PLAYING;
			target.data.game = this.activeGames.length;
			target.leave('queue');
			players[i] = target;
			const player = await this.prisma.findUserById(players[i].data.user);
			// player.inGame = true
			player.haveInvitation = false;
			player.matchs +=1; 
			this.prisma.updateUser(player.id,player);
		}

		const room_name = 'game_' + players[0].id + '_' + players[1].id;
		// create game entity
		let game_entry = new Game();
		//console.log("test")
		game_entry.p1 = await this.prisma.findUserById(players[0].data.user);
		game_entry.p2 = await this.prisma.findUserById( players[1].data.user);
		game_entry.scorP1 = 0;
		game_entry.scorP2 = 0;
		game_entry.playedOn = new Date(Date.now());
	//	const game_one =await this.gameRepository.save(game_entry);
    const game_one = await this.createGame(game_entry);

		const game: GameState = {
			paddle1: 0, paddle2: 0,
			ballX: 0, ballY: 0,
			ballVelX: 2, ballVelY: 0,
			score1: 0, score2: 0,

			player1: players[0].data.user,
			player1_socket: players[0].id,
			player1_pressUp: false,
			player1_pressDown: false,

			player2_socket: players[1].id,
			player2_pressUp: false,
			player2_pressDown: false,
			player2: players[1].data.user,
			game_entity:game_one.id
		};

		this.activeGames.push(game);
		const sanitizedGame = this.sanitizeGameState(game);

		for (let i = 0; i < 2; i++) {
			players[i].data.game = this.activeGames.indexOf(game);
			players[i].join(room_name);

			players[i].emit('gameStart', sanitizedGame);
		}
	}

	async endGame(server: Server, game: GameState) {
		const room_name = 'game_' + game.player1_socket + '_' + game.player2_socket;
		const winner = game.score1 > game.score2 ? game.player1_socket : game.player2_socket;
		const sockets = server.sockets.sockets;

		try {
			sockets.get(game.player1_socket).data.state = PlayerState.NONE;
			sockets.get(game.player1_socket).data.game = undefined;
		} catch {
			console.log('End of game: Player 1 has ;disconnected');
		}
		try {
			sockets.get(game.player2_socket).data.state = PlayerState.NONE;
			sockets.get(game.player2_socket).data.game = undefined;
		} catch {
			console.log('End of game: Player 2 has disconnected');
		}

		//Update des stats de chaque user ************

			let game_entry = await this.findOneGameById(game.game_entity)

			game_entry.scorP1 = game.score1;
			game_entry.scorP2 = game.score2;
			this.updateGameScore(game_entry, game_entry.scorP1, game_entry.scorP2);

		if (game.player1 !== game.player2) {
			const winner = this.prisma.quickFix(Math.max(game.score1, game.score2) === game.score1 ? game_entry.p1 : game_entry.p2);
			const loser = this.prisma.quickFix(Math.min(game.score1, game.score2) === game.score1 ? game_entry.p1 : game_entry.p2);
			const scoreDiff = Math.max(game.score1, game.score2) - Math.min(game.score1, game.score2);

			winner.wins += 1;
			loser.lose += 1;

			// winner.inGame = false
			// loser.inGame = false

			this.prisma.updateUser(winner.id, winner);
			this.prisma.updateUser(loser.id, loser);

		}

		server.to(room_name).emit('gameEnd', {
			winner: sockets.get(winner)?.data.user,
			game: this.sanitizeGameState(game)
		});

		this.activeGames.splice(this.activeGames.indexOf(game), 1);
	}

	joinQueue(client: UserSocket, server: Server): boolean {
    console.log(client.data, PlayerState);
		if (client.data.state != PlayerState.NONE)
			return false;
		client.data.state = PlayerState.WAITING;
		client.join('queue');
		this.startGame(server,client.data.user);
		return true;
	}


	async privateStartGame(server: Server,p_room_name:string){
		const room = server.sockets.adapter.rooms.get(p_room_name);
		if (room.size < 2)
			return;

		let room_iter = room.values();
		let players: UserSocket[] = [undefined, undefined]

		for (let i = 0; i < 2; i++) {
			const target = server.sockets.sockets.get(room_iter.next().value) as UserSocket;
			target.data.state = PlayerState.PLAYING;
			target.data.game = this.activeGames.length;
			target.leave(p_room_name);
			players[i] = target;
			const player = await this.prisma.findUserById(players[i].data.user);
			// player.inGame = true
			player.haveInvitation = false;
			player.matchs +=1; 
			this.prisma.updateUser(player.id,player);
		}
		const room_name = 'game_' + players[0].id + '_' + players[1].id;
		// create game entity
		let game_entry = new Game();
		game_entry.p1 = await this.prisma.findUserById(players[0].data.user);
		game_entry.p2 = await this.prisma.findUserById( players[1].data.user);   
		game_entry.scorP1 = 0;
		game_entry.scorP2 = 0;
		game_entry.playedOn = new Date(Date.now());
		//const game_one =await this.gameRepository.save(game_entry);
    const game_one = await this.createGame(game_entry);

		const game: GameState = {
			paddle1: 0, paddle2: 0,
			ballX: 0, ballY: 0,
			ballVelX: 2, ballVelY: 0,
			score1: 0, score2: 0,

			player1: players[0].data.user,
			player1_socket: players[0].id,
			player1_pressUp: false,
			player1_pressDown: false,

			player2_socket: players[1].id,
			player2_pressUp: false,
			player2_pressDown: false,
			player2: players[1].data.user,
			game_entity:game_one.id
		};
			
		this.activeGames.push(game);
		const sanitizedGame = this.sanitizeGameState(game);
		for (let i = 0; i < 2; i++) {
			players[i].data.game = this.activeGames.indexOf(game);
			players[i].join(room_name);

			players[i].emit('gameStart', sanitizedGame);
		}	

	}

	async joinPrivateQueue(client: UserSocket, server: Server,body:any): Promise<boolean> {
		if (client.data.state != PlayerState.NONE)
			return false;

		client.data.state = PlayerState.WAITING;
		let  room_name:any
    // console.log('BODY ======= ', body);
		if(body.owner){
			room_name = 'private_'+client.data.user+"_"+body.second
      const friend = +body.second;
      await this.prisma.updateInvitation(friend);
      // console.log('update user invit');
		}
		else{
			room_name = 'private_'+body.second+"_"+client.data.user;
		}
		
		client.join(room_name);
		this.privateStartGame(server,room_name);
		return true;
	}

	leaveQueue(client: UserSocket): boolean {
		if (client.data.state != PlayerState.WAITING)
			return false;

		client.data.state = PlayerState.NONE;
		client.leave('queue');
		return true;
	}

	abondonGame(server: Server, client: UserSocket) {
		for (let game of this.activeGames) {
			if (game.player1_socket == client.id) {
				game.score1 = -1;
				game.score2 = 11;
				this.endGame(server, game);
				break;
			}

			else if (game.player2_socket == client.id) {
				game.score1 = 11;
				game.score2 = -1;
				this.endGame(server, game);
				break;
			}
		}
	}

	shiftDirection(client: UserSocket, isUp: boolean, press: boolean) {
		if (client.data.state != PlayerState.PLAYING)
			return;
		const game = this.activeGames[client.data.game];

		if (game.player1_socket == client.id) {
			if (isUp)
				game.player1_pressUp = press;
			else
				game.player1_pressDown = press;
		}

		else if (game.player2_socket == client.id) {
			if (isUp)
				game.player2_pressUp = press;
			else
				game.player2_pressDown = press;
		}
	}

	// async getAllHistories(user_id:number){
	// 	const user1:Game[] = await this.gameRepository.find({
	// 		where:{
	// 			p1:{id:user_id}
	// 		},
	// 		relations:["Player1", "Player2"],
	// 		order:{
	// 			playedOn:"DESC"
	// 		}
	// 	})
	// 	const user2:Game[] = await this.gameRepository.find({
	// 		where:{
	// 			p2:{id:user_id}
	// 		},
	// 		relations:["Player1", "Player2"],
	// 		order:{
	// 			playedOn:"DESC"
	// 		}
	// 	})
	// 	return [...user1, ...user2]
	// }

  async getAllHistories(userId: number): Promise<any> {
    //console.log('History ID = ', userId);
    // Récupérez tous les jeux où l'utilisateur est le joueur 1
    const user1Games = await this.prisma.game.findMany({
      where: { p1Id: userId },
      orderBy: { playedOn: 'desc' },
      include: { 
        p1: {
          select: {
            name: true
          }
        },
        p2: {
          select: {
            name: true
          }
        },
      },
    });

    // Récupérez tous les jeux où l'utilisateur est le joueur 2
    const user2Games = await this.prisma.game.findMany({
      where: { p2Id: userId },
      orderBy: { playedOn: 'desc' },
      include: {
        p1: {
          select: {
            name: true
          }
        },
        p2: {
          select: {
            name: true
          }
        },
      }, // Incluez les détails des joueurs
    });

    //console.log('History p1= ', user1Games);
    //console.log('history p2= ', user2Games);

    return [...user1Games, ...user2Games];
  }


	// async findOneGameById(game_id:number){
	// 	return this.gameRepository.findOne({
	// 		where:{
	// 			id:game_id
	// 		},
	// 		relations:["Player1", "Player2"]
	// 	})
	// }

  async findOneGameById(gameId: number): Promise<Game | null> {
    // Récupérez le jeu par son ID avec les détails des joueurs inclus
    return this.prisma.game.findUnique({
      where: { id: gameId },
      include: { p1: true, p2: true }, // Incluez les détails des joueurs
    });
  }

}
