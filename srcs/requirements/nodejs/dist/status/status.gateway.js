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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const status_service_1 = require("./status.service");
let StatusGateway = class StatusGateway {
    constructor(statusService) {
        this.statusService = statusService;
    }
    afterInit() {
        console.log('WebSocket Status Gateway initialized');
    }
    async handleConnection(client) {
        console.log('Status New connection');
        await this.statusService.handleconnection(client);
    }
    handleDisconnect(client) {
        this.statusService.handledisconnect(client);
        console.log('Status Disconnected');
    }
    async setOnLine(client) {
        await this.statusService.setOnLine(client);
    }
    async setOffLine(client) {
        await this.statusService.setOffLine(client);
    }
    async setInGame(client) {
        await this.statusService.setInGame(client);
    }
    async setInChat(client) {
        await this.statusService.setInChat(client);
    }
};
exports.StatusGateway = StatusGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], StatusGateway.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], StatusGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], StatusGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('onLine'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], StatusGateway.prototype, "setOnLine", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('offLine'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], StatusGateway.prototype, "setOffLine", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('inGame'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], StatusGateway.prototype, "setInGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('inChat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], StatusGateway.prototype, "setInChat", null);
exports.StatusGateway = StatusGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'status',
        cors: {
            origin: '*',
        }
    }),
    __metadata("design:paramtypes", [status_service_1.StatusService])
], StatusGateway);
//# sourceMappingURL=status.gateway.js.map