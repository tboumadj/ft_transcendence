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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
let ChatGateway = class ChatGateway {
    constructor(chatservice) {
        this.chatservice = chatservice;
    }
    afterInit() {
        console.log('WebSocket Gateway initialized');
    }
    async handleConnection(client) {
        console.log('New connection');
        await this.chatservice.handleconnection(client);
        this.server.to(client.id).emit("message", { status: "ok", data: "subed" });
    }
    handleDisconnect(client) {
        this.chatservice.handledisconnect(client);
        console.log('Disconnected');
    }
    async handleChannel(client, body) {
        console.log("channelGateway");
        const dto = JSON.parse(body);
        const [roomId, message] = await this.chatservice.handlechannel(dto.event, client, dto);
        this.server.to(roomId).emit("channel", message);
    }
    async handleMessage(client, body) {
        console.log("messageGatway");
        const dto = JSON.parse(body);
        let status = "";
        if (dto.content && dto.id)
            status = "MODIFY";
        else if (!dto.content && dto.id)
            status = "DELETE";
        else if (dto.content && dto.channel_name)
            status = "CREATE";
        const [roomId, message] = await this.chatservice.messageEvent(client, dto);
        client.join(roomId);
        this.server.to(roomId).emit("message", { status: status, data: message });
    }
    async handleEvent(client, dto) {
        const dtoParsed = JSON.parse(dto);
        const [status, roomId, message] = await this.chatservice.handleEvent(client, dtoParsed);
        client.join(roomId);
        this.server.to(roomId).emit("event", { status: status, data: message });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('channel'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('event'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleEvent", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'chat',
        cors: {
            origin: '*',
        }
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map