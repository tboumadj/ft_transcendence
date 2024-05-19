"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../users/prisma.service");
const game_entity_1 = require("./entity/game.entity");
const gamestate_entity_1 = require("./entity/gamestate.entity");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const jwt_1 = require("@nestjs/jwt");
let GameService = class GameService {
    constructor(prisma, jwt, authGuard) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.authGuard = authGuard;
        this.activeGames = [];
    }
    sanitizeGameState(game) {
        const sanitized = { ...game };
        delete sanitized.player1_socket;
        delete sanitized.player2_socket;
        delete sanitized.player1_pressUp;
        delete sanitized.player2_pressUp;
        delete sanitized.player1_pressDown;
        delete sanitized.player2_pressDown;
        return sanitized;
    }
    async createGame(gameEntry) {
        const createdGame = await this.prisma.game.create({
            data: {
                p1: { connect: { id: gameEntry.p1.id } },
                p2: { connect: { id: gameEntry.p2.id } },
                scorP1: gameEntry.scorP1,
                scorP2: gameEntry.scorP2,
                playedOn: gameEntry.playedOn,
            },
        });
        const game = {
            id: createdGame.id,
            p1: gameEntry.p1,
            p2: gameEntry.p2,
            scorP1: createdGame.scorP1,
            scorP2: createdGame.scorP2,
            playedOn: createdGame.playedOn,
        };
        return game;
    }
    async updateGameScore(game, score1, score2) {
        await this.prisma.game.update({
            where: { id: game.id },
            data: { scorP1: score1, scorP2: score2 },
        });
    }
    updateGames(server) {
        for (let game of this.activeGames) {
            let playSound = false;
            if (game.ballX >= gamestate_entity_1.GameConstants.LEFT
                && game.ballVelX >= 0) {
                game.score1 += 1;
                game.ballVelX = -2;
            }
            else if (game.ballX <= gamestate_entity_1.GameConstants.RIGHT
                && game.ballVelX <= 0) {
                game.score2 += 1;
                game.ballVelX = 2;
            }
            if (game.ballX <= gamestate_entity_1.GameConstants.RIGHT || game.ballX >= gamestate_entity_1.GameConstants.LEFT) {
                game.ballVelY = 0;
                game.ballX = 0;
                game.ballY = 0;
                game.paddle1 = 0;
                game.paddle2 = 0;
            }
            if ((game.score1 > 10 || game.score2 > 10)
                && (Math.abs(game.score1 - game.score2) >= 2)) {
                this.endGame(server, game);
                continue;
            }
            if (game.player1_pressDown)
                game.paddle1 < gamestate_entity_1.GameConstants.TOP - (gamestate_entity_1.GameConstants.PADDLE_HEIGHT / 2) ? game.paddle1 += 2 : game.paddle1;
            if (game.player1_pressUp)
                game.paddle1 > gamestate_entity_1.GameConstants.BOTTOM + (gamestate_entity_1.GameConstants.PADDLE_HEIGHT / 2) ? game.paddle1 -= 2 : game.paddle1;
            if (game.player2_pressDown)
                game.paddle2 < gamestate_entity_1.GameConstants.TOP - (gamestate_entity_1.GameConstants.PADDLE_HEIGHT / 2) ? game.paddle2 += 2 : game.paddle2;
            if (game.player2_pressUp)
                game.paddle2 > gamestate_entity_1.GameConstants.BOTTOM + (gamestate_entity_1.GameConstants.PADDLE_HEIGHT / 2) ? game.paddle2 -= 2 : game.paddle2;
            game.ballX += game.ballVelX;
            game.ballY += game.ballVelY;
            if ((game.ballY + (gamestate_entity_1.GameConstants.BALL_RADIUS / 2) >= gamestate_entity_1.GameConstants.TOP && game.ballVelY >= 0)
                || (game.ballY - (gamestate_entity_1.GameConstants.BALL_RADIUS / 2) <= gamestate_entity_1.GameConstants.BOTTOM && game.ballVelY <= 0)) {
                game.ballVelY = -game.ballVelY;
                playSound = true;
            }
            if ((game.ballX + (gamestate_entity_1.GameConstants.BALL_RADIUS / 2) >= gamestate_entity_1.GameConstants.LEFT - gamestate_entity_1.GameConstants.PADDLE_WIDTH
                && game.ballY <= game.paddle2 + (gamestate_entity_1.GameConstants.PADDLE_HEIGHT / 2)
                && game.ballY >= game.paddle2 - (gamestate_entity_1.GameConstants.PADDLE_HEIGHT / 2)
                && game.ballVelX >= 0)
                || (game.ballX - (gamestate_entity_1.GameConstants.BALL_RADIUS / 2) <= gamestate_entity_1.GameConstants.RIGHT + gamestate_entity_1.GameConstants.PADDLE_WIDTH
                    && game.ballY <= game.paddle1 + (gamestate_entity_1.GameConstants.PADDLE_HEIGHT / 2)
                    && game.ballY >= game.paddle1 - (gamestate_entity_1.GameConstants.PADDLE_HEIGHT / 2)
                    && game.ballVelX <= 0)) {
                game.ballVelX = (-game.ballVelX) * 1.1;
                game.ballVelY = (Math.random() - 0.5) * 8;
                playSound = true;
            }
            const room_name = 'game_' + game.player1_socket + '_' + game.player2_socket;
            const sanitizedGame = this.sanitizeGameState(game);
            server.to(room_name).emit('gameUpdate', { ...sanitizedGame, playSound: playSound });
        }
    }
    async connect(client) {
        const user = await this.getUserSocket(client);
        if (!user) {
            console.log("NOT USER");
            client.disconnect(true);
            return;
        }
        client.data.state = gamestate_entity_1.PlayerState.NONE;
        client.data.game = undefined;
        client.data.user = user.id;
        const one = await this.prisma.findUserById(+client.data.user);
        one.inGame = true;
        this.prisma.updateUser(one.id, one);
    }
    async getUserSocket(client) {
        const jwt = client.handshake.headers.cookies;
        const username = this.jwt.decode(jwt).sub;
        const user = await this.prisma.user.findUnique(({ where: { id: username } }));
        if (!user)
            throw ('User not found');
        return user;
    }
    async disconnect(server, client) {
        if (isNaN(+client.data.user))
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
        const one = await this.prisma.findUserById(+client.data.user);
        one.inGame = false;
        this.prisma.updateUser(one.id, one);
        console.log('Client disconnected');
    }
    async startGame(server, user_id) {
        const room = server.sockets.adapter.rooms.get('queue');
        if (room.size < 2) {
            return;
        }
        let room_iter = room.values();
        let players = [undefined, undefined];
        for (let i = 0; i < 2; i++) {
            const target = server.sockets.sockets.get(room_iter.next().value);
            target.data.state = gamestate_entity_1.PlayerState.PLAYING;
            target.data.game = this.activeGames.length;
            target.leave('queue');
            players[i] = target;
            const player = await this.prisma.findUserById(players[i].data.user);
            player.haveInvitation = false;
            player.matchs += 1;
            this.prisma.updateUser(player.id, player);
        }
        const room_name = 'game_' + players[0].id + '_' + players[1].id;
        let game_entry = new game_entity_1.Game();
        game_entry.p1 = await this.prisma.findUserById(players[0].data.user);
        game_entry.p2 = await this.prisma.findUserById(players[1].data.user);
        game_entry.scorP1 = 0;
        game_entry.scorP2 = 0;
        game_entry.playedOn = new Date(Date.now());
        const game_one = await this.createGame(game_entry);
        const game = {
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
            game_entity: game_one.id
        };
        this.activeGames.push(game);
        const sanitizedGame = this.sanitizeGameState(game);
        for (let i = 0; i < 2; i++) {
            players[i].data.game = this.activeGames.indexOf(game);
            players[i].join(room_name);
            players[i].emit('gameStart', sanitizedGame);
        }
    }
    async endGame(server, game) {
        const room_name = 'game_' + game.player1_socket + '_' + game.player2_socket;
        const winner = game.score1 > game.score2 ? game.player1_socket : game.player2_socket;
        const sockets = server.sockets.sockets;
        try {
            sockets.get(game.player1_socket).data.state = gamestate_entity_1.PlayerState.NONE;
            sockets.get(game.player1_socket).data.game = undefined;
        }
        catch {
            console.log('End of game: Player 1 has ;disconnected');
        }
        try {
            sockets.get(game.player2_socket).data.state = gamestate_entity_1.PlayerState.NONE;
            sockets.get(game.player2_socket).data.game = undefined;
        }
        catch {
            console.log('End of game: Player 2 has disconnected');
        }
        let game_entry = await this.findOneGameById(game.game_entity);
        game_entry.scorP1 = game.score1;
        game_entry.scorP2 = game.score2;
        this.updateGameScore(game_entry, game_entry.scorP1, game_entry.scorP2);
        if (game.player1 !== game.player2) {
            const winner = this.prisma.quickFix(Math.max(game.score1, game.score2) === game.score1 ? game_entry.p1 : game_entry.p2);
            const loser = this.prisma.quickFix(Math.min(game.score1, game.score2) === game.score1 ? game_entry.p1 : game_entry.p2);
            const scoreDiff = Math.max(game.score1, game.score2) - Math.min(game.score1, game.score2);
            winner.wins += 1;
            loser.lose += 1;
            this.prisma.updateUser(winner.id, winner);
            this.prisma.updateUser(loser.id, loser);
        }
        server.to(room_name).emit('gameEnd', {
            winner: sockets.get(winner)?.data.user,
            game: this.sanitizeGameState(game)
        });
        this.activeGames.splice(this.activeGames.indexOf(game), 1);
    }
    joinQueue(client, server) {
        console.log(client.data, gamestate_entity_1.PlayerState);
        if (client.data.state != gamestate_entity_1.PlayerState.NONE)
            return false;
        client.data.state = gamestate_entity_1.PlayerState.WAITING;
        client.join('queue');
        this.startGame(server, client.data.user);
        return true;
    }
    async privateStartGame(server, p_room_name) {
        const room = server.sockets.adapter.rooms.get(p_room_name);
        if (room.size < 2)
            return;
        let room_iter = room.values();
        let players = [undefined, undefined];
        for (let i = 0; i < 2; i++) {
            const target = server.sockets.sockets.get(room_iter.next().value);
            target.data.state = gamestate_entity_1.PlayerState.PLAYING;
            target.data.game = this.activeGames.length;
            target.leave(p_room_name);
            players[i] = target;
            const player = await this.prisma.findUserById(players[i].data.user);
            player.haveInvitation = false;
            player.matchs += 1;
            this.prisma.updateUser(player.id, player);
        }
        const room_name = 'game_' + players[0].id + '_' + players[1].id;
        let game_entry = new game_entity_1.Game();
        game_entry.p1 = await this.prisma.findUserById(players[0].data.user);
        game_entry.p2 = await this.prisma.findUserById(players[1].data.user);
        game_entry.scorP1 = 0;
        game_entry.scorP2 = 0;
        game_entry.playedOn = new Date(Date.now());
        const game_one = await this.createGame(game_entry);
        const game = {
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
            game_entity: game_one.id
        };
        this.activeGames.push(game);
        const sanitizedGame = this.sanitizeGameState(game);
        for (let i = 0; i < 2; i++) {
            players[i].data.game = this.activeGames.indexOf(game);
            players[i].join(room_name);
            players[i].emit('gameStart', sanitizedGame);
        }
    }
    async joinPrivateQueue(client, server, body) {
        if (client.data.state != gamestate_entity_1.PlayerState.NONE)
            return false;
        client.data.state = gamestate_entity_1.PlayerState.WAITING;
        let room_name;
        if (body.owner) {
            room_name = 'private_' + client.data.user + "_" + body.second;
            const friend = +body.second;
            await this.prisma.updateInvitation(friend);
        }
        else {
            room_name = 'private_' + body.second + "_" + client.data.user;
        }
        client.join(room_name);
        this.privateStartGame(server, room_name);
        return true;
    }
    leaveQueue(client) {
        if (client.data.state != gamestate_entity_1.PlayerState.WAITING)
            return false;
        client.data.state = gamestate_entity_1.PlayerState.NONE;
        client.leave('queue');
        return true;
    }
    abondonGame(server, client) {
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
    shiftDirection(client, isUp, press) {
        if (client.data.state != gamestate_entity_1.PlayerState.PLAYING)
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
    async getAllHistories(userId) {
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
            },
        });
        return [...user1Games, ...user2Games];
    }
    async findOneGameById(gameId) {
        return this.prisma.game.findUnique({
            where: { id: gameId },
            include: { p1: true, p2: true },
        });
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        jwt_auth_guard_1.AuthMiddleware])
], GameService);
//# sourceMappingURL=game.service.js.map