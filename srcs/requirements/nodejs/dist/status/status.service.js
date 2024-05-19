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
exports.StatusService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
let StatusService = class StatusService {
    constructor(jwt, prisma) {
        this.jwt = jwt;
        this.prisma = prisma;
        this.clients = new Map;
    }
    async handleconnection(client) {
        try {
            const user = await this.getUserSocket(client);
            this.clients.set(user.id, { id: user.id, socket: client, state: 1 });
            client.join('logged');
            client.to('logged').emit('update', { room: 'logged' });
        }
        catch (error) {
            console.error('SocketStatus error: ', error);
        }
    }
    async handledisconnect(client) {
        try {
            const user = await this.getUserSocket(client);
            this.clients.delete(user.id);
            client.to('logged').emit('update', { room: 'logged' });
            client.disconnect();
        }
        catch (error) {
            console.error('SocketStatus error: ', error);
        }
    }
    async getUserSocket(client) {
        try {
            const jwt = client.handshake.headers.cookies;
            const username = this.jwt.decode(jwt).sub;
            const user = await this.prisma.user.findUnique(({ where: { id: username } }));
            if (!user)
                throw ('User not found');
            return user;
        }
        catch (error) {
            console.error('SocketStatus error: ', error);
        }
    }
    async setOnLine(client) {
        try {
            const user = await this.getUserSocket(client);
            this.clients.set(user.id, { id: user.id, socket: client, state: 1 });
            console.log('Status is [Online]');
            client.to('logged').emit('update', { room: 'logged' });
        }
        catch (error) {
            console.error('Cannot change Status : ', error);
        }
    }
    async setOffLine(client) {
        try {
            const user = await this.getUserSocket(client);
            this.clients.set(user.id, { id: user.id, socket: client, state: 0 });
            this.handledisconnect(client);
            console.log('Status is [Offline]');
        }
        catch (error) {
            console.error('Cannot change Status : ', error);
        }
    }
    async setInGame(client) {
        try {
            const user = await this.getUserSocket(client);
            this.clients.set(user.id, { id: user.id, socket: client, state: 2 });
            console.log('Status is [Ingame]');
            client.to('logged').emit('update', { room: 'logged' });
        }
        catch (error) {
            console.error('Cannot change Status : ', error);
        }
    }
    async setInChat(client) {
        try {
            const user = await this.getUserSocket(client);
            this.clients.set(user.id, { id: user.id, socket: client, state: 3 });
            console.log('Status is [Inchat]');
            client.to('logged').emit('update', { room: 'logged' });
        }
        catch (error) {
            console.error('Cannot change Status : ', error);
        }
    }
    getStatus() {
        try {
            const result = new Map(this.clients);
            result.forEach(e => delete (e.socket));
            const Nresult = Object.fromEntries(result);
            return JSON.stringify(Nresult);
        }
        catch (error) {
            console.error('SocketStatus error: ', error);
        }
    }
};
exports.StatusService = StatusService;
exports.StatusService = StatusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], StatusService);
//# sourceMappingURL=status.service.js.map