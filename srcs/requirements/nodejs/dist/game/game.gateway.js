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
const websockets_1 = require("@nestjs/websockets");
const gamestate_entity_1 = require("./entity/gamestate.entity");
const socket_io_1 = require("socket.io");
const game_service_1 = require("./game.service");
let GameGateway = class GameGateway {
    constructor(gameService) {
        this.gameService = gameService;
    }
    afterInit(server) {
        this.gameThread = setInterval(() => this.gameService.updateGames(server), 1000 / 20);
    }
    handleConnection(client, ...args) {
        this.gameService.connect(client);
    }
    handleDisconnect(client) {
        this.gameService.disconnect(this.server, client);
    }
    joinQueue(client, data) {
        const success = this.gameService.joinQueue(client, this.server);
        return success
            ? { event: 'joinQueueSuccess', data: '' }
            : { event: 'joinQueueError', data: '' };
    }
    privateQueue(client, body) {
        const my_body = {
            owner: body.owner,
            second: body.second,
            accept: body.accept,
        };
        const success = this.gameService.joinPrivateQueue(client, this.server, my_body);
        return success
            ? { event: 'joinPrivateQueueSuccess', data: '' }
            : { event: 'joinQueueError', data: '' };
    }
    leaveQueue(client, data) {
        const success = this.gameService.leaveQueue(client);
        return success
            ? { event: 'leaveQueueSuccess', data: '' }
            : { event: 'leaveQueueError', data: '' };
    }
    abondonGame(client) {
        this.gameService.abondonGame(this.server, client);
    }
    paddleMoveUp(client) {
        this.gameService.shiftDirection(client, true, true);
    }
    paddleMoveDown(client) {
        this.gameService.shiftDirection(client, false, true);
    }
    paddleStopUp(client) {
        this.gameService.shiftDirection(client, true, false);
    }
    paddleStopDown(client) {
        this.gameService.shiftDirection(client, false, false);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinQueue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gamestate_entity_1.UserSocket, String]),
    __metadata("design:returntype", Object)
], GameGateway.prototype, "joinQueue", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('privateQueue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gamestate_entity_1.UserSocket, Object]),
    __metadata("design:returntype", Object)
], GameGateway.prototype, "privateQueue", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveQueue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gamestate_entity_1.UserSocket, String]),
    __metadata("design:returntype", Object)
], GameGateway.prototype, "leaveQueue", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('abondonGame'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gamestate_entity_1.UserSocket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "abondonGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('startUp'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gamestate_entity_1.UserSocket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "paddleMoveUp", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('startDown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gamestate_entity_1.UserSocket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "paddleMoveDown", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('stopUp'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gamestate_entity_1.UserSocket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "paddleStopUp", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('stopDown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gamestate_entity_1.UserSocket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "paddleStopDown", null);
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*"
        },
        connectTimeout: 10000,
    }),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameGateway);
;
exports.default = GameGateway;
//# sourceMappingURL=game.gateway.js.map