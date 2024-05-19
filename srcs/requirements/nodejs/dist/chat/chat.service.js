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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt_nodejs_1 = require("bcrypt-nodejs");
const chat_entity_1 = require("./entity/chat.entity");
const class_transformer_1 = require("class-transformer");
const jwt_1 = require("@nestjs/jwt");
let ChatService = class ChatService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.clients = new Map;
    }
    async handleconnection(client) {
        try {
            const user = await this.getUserSocket(client);
            const channel = await this.prisma.groupes.findMany();
            this.clients.set(user.name, client.id);
            for (let i = 0; i < channel.length; i++) {
                if (channel[i].members.includes(user.id)) {
                    console.log(channel[i].id.toString());
                }
            }
        }
        catch (error) {
            console.error('Error handleConnection chat');
        }
    }
    async handledisconnect(client) {
        client.disconnect();
    }
    async messagesChannel(channel, req) {
        try {
            const username = await this.getUsernameJwt(req);
            const user = await this.prisma.user.findUnique({ where: { name: username } });
            const groupe = await this.prisma.groupes.findUnique({ where: { channel_name: channel } });
            if (groupe.members.includes(user.id))
                return await this.prisma.messages.findMany({ where: { receiver: groupe.id } });
        }
        catch (error) {
        }
    }
    async myChannels(client) {
        const user = await this.getUserSocket(client);
        if (!user)
            throw ("userNotAuthorized");
        const all_channels = (0, class_transformer_1.plainToClass)(chat_entity_1.GroupeEntity, await this.prisma.groupes.findMany());
        let grps = [];
        let joined = [];
        for (let i = 0; i < all_channels.length; i++) {
            if (all_channels[i].members.includes(user.id)) {
                if (all_channels[i].private_message) {
                    const users = all_channels[i].channel_name.split("$");
                    if (users[1] == user.name)
                        all_channels[i].displayName = users[2];
                    else
                        all_channels[i].displayName = users[1];
                }
                else
                    all_channels[i].displayName = all_channels[i].channel_name;
                grps.push(all_channels[i]);
                joined.push(all_channels[i].id.toString());
            }
        }
        return [client.id, { status: "GET", data: grps }];
    }
    async usersChannel(channel, req) {
        try {
            const username = await this.getUsernameJwt(req);
            const user = await this.prisma.user.findUnique({ where: { name: username } });
            const groupe = await this.prisma.groupes.findUnique({ where: { channel_name: channel } });
            if (!groupe.members.includes(user.id))
                throw "NotAuthorized";
            const groupeUsers = await this.prisma.user.findMany({ where: {
                    id: { in: groupe.members
                    }
                },
                select: {
                    id: true,
                    name: true,
                    pseudo: true,
                    avatar: true,
                } });
            return groupeUsers;
        }
        catch (error) {
            return error;
        }
    }
    async informationChannel(channel, req) {
        try {
            const username = await this.getUsernameJwt(req);
            const user = await this.prisma.user.findUnique({ where: { name: username } });
            let groupe = await this.prisma.groupes.findUnique({ where: { channel_name: channel } });
            await this.prisma.user.findMany({ where: { id: { in: groupe.members } } });
            if (!groupe || !groupe.members.includes(user.id))
                throw ("userNotAuthorized");
            return ((0, class_transformer_1.plainToClass)(chat_entity_1.GroupeEntity, groupe));
        }
        catch (error) {
            return error;
        }
    }
    async handlechannel(event, client, dto) {
        try {
            switch (event) {
                case "CREATE":
                    return await this.createChannel(client, dto);
                case "MODIFY":
                    return await this.modifyChannel(client, dto);
                case "DELETE":
                    return await this.deleteChannel(client, dto.id);
                case "PRIVATE":
                    return await this.privateChannel(client, dto);
                case "GET":
                    return await this.myChannels(client);
                default:
                    throw "";
            }
        }
        catch (error) {
            return [client.id.toString(), { status: "ERROR", data: error }];
        }
    }
    async createChannel(client, dto) {
        const user = await this.getUserSocket(client);
        const groupeExist = await this.prisma.groupes.findUnique({ where: { channel_name: dto.channel_name } });
        if (dto.channel_name[0] == "$")
            throw "$ : first char is not authorized";
        if (groupeExist)
            throw "groupe already exist";
        const body = { status: "CREATE", data: (0, class_transformer_1.plainToClass)(chat_entity_1.GroupeEntity, await this.prisma.groupes.create({ data: {
                    channel_name: dto.channel_name,
                    password: this.getPassword(dto.password),
                    private_groupe: dto.private_groupe,
                    private_message: false,
                    owner: user.id,
                    admin: [user.id],
                    members: [user.id]
                } })) };
        body.data.displayName = body.data.channel_name;
        client.join(body.data.id.toString());
        return [client.id.toString(), body];
    }
    async modifyChannel(client, dto) {
        const user = await this.getUserSocket(client);
        const find_groupe = await this.prisma.groupes.findUnique({ where: { id: dto.id } });
        if (!find_groupe || (!find_groupe.admin.includes(user.id) && find_groupe.owner != user.id))
            throw "error groupe";
        const body = { status: "MODIFY", data: (0, class_transformer_1.plainToClass)(chat_entity_1.GroupeEntity, await this.prisma.groupes.update({
                where: {
                    id: dto.id
                },
                data: {
                    channel_name: dto.channel_name,
                    password: this.getPassword(dto.password),
                    private_groupe: dto.private_groupe,
                    owner: user.id,
                }
            })) };
        body.data.displayName = body.data.channel_name;
        return [client.id, body];
    }
    async privateChannel(client, dto) {
        const user = await this.getUserSocket(client);
        const groupeExist = await this.prisma.groupes.findUnique({ where: { channel_name: dto.channel_name } });
        if (groupeExist)
            throw "groupe already exist";
        const friend = await this.prisma.user.findUnique({ where: { name: dto.channel_name } });
        if (user.blocked.includes(friend.id) || friend.blocked.includes(user.id))
            throw "Blocked";
        const body = { status: "PRIVATE", data: (0, class_transformer_1.plainToClass)(chat_entity_1.GroupeEntity, await this.prisma.groupes.create({ data: {
                    channel_name: "$" + user.name + "$" + dto.channel_name,
                    password: this.getPassword(""),
                    private_groupe: true,
                    private_message: true,
                    owner: 0,
                    admin: [0],
                    members: [user.id, friend.id],
                } })) };
        body.data.displayName = body.data.channel_name;
        client.join(body.data.id.toString());
        return [[client.id.toString(), this.clients.get(friend.name)], body];
    }
    async deleteChannel(client, id) {
        const user = await this.getUserSocket(client);
        const find_groupe = await this.prisma.groupes.findUnique({ where: { id: id } });
        if (!find_groupe || find_groupe.owner != user.id)
            throw "error groupe";
        const body = { status: "DELETE", data: ((0, class_transformer_1.plainToClass)(chat_entity_1.GroupeEntity, await this.prisma.groupes.delete({ where: { id: id } }))) };
        await this.prisma.messages.deleteMany({ where: { receiver: id } });
        return [client.id.toString(), body];
    }
    async handleEvent(client, dto) {
        switch (dto.event) {
            case "BAN":
                return this.banUser(dto, client);
            case "UNBAN":
                return this.unBanUser(dto, client);
            case "KICK":
                return this.kickUser(dto, client);
            case "PROMOTE":
                return this.promuteUser(dto, client);
            case "UNPROMOTE":
                return this.unPromuteUser(dto, client);
            case "JOIN":
                return this.joinChannel(dto, client);
            case "LEFT":
                return this.leftChannel(dto, client);
            default:
                return ["ERROR", client.id, "Bad event"];
        }
    }
    async joinChannel(dto, client) {
        try {
            const id = (await this.getUserSocket(client)).id;
            let groupe = await this.prisma.groupes.findUnique({ where: {
                    channel_name: dto.channel_name,
                    private_message: false,
                } });
            if (groupe.private_groupe && (0, bcrypt_nodejs_1.compareSync)(dto.password, groupe.password) == false) {
                throw "badCredentials";
            }
            if (groupe.banned.includes(id))
                throw "userNotAuthorized";
            if (groupe.members.includes(id))
                throw "alreadyInchannel";
            groupe.members.push(id);
            client.join(groupe.id.toString());
            const groupeUpdated = (0, class_transformer_1.plainToClass)(chat_entity_1.GroupeEntity, await this.prisma.groupes.update({
                where: {
                    id: groupe.id
                },
                data: {
                    members: groupe.members
                }
            }));
            groupeUpdated.displayName = groupeUpdated.channel_name;
            return [dto.event, [groupe.id.toString(), client.id], groupeUpdated];
        }
        catch (error) {
            return ["ERROR", client.id, error];
        }
    }
    async leftChannel(dto, client) {
        const id = (await this.getUserSocket(client)).id;
        try {
            const groupe = await this.prisma.groupes.findUnique({ where: { channel_name: dto.channel_name } });
            if (!groupe.members.includes(id) || groupe.private_message)
                throw "Not authorized";
            groupe.members.splice(groupe.members.indexOf(id), 1);
            if (groupe.admin.includes(id))
                groupe.admin.splice(groupe.admin.indexOf(id), 1);
            const groupeUpdated = (0, class_transformer_1.plainToClass)(chat_entity_1.GroupeEntity, await this.prisma.groupes.update({
                where: {
                    id: groupe.id
                },
                data: {
                    members: groupe.members,
                    admin: groupe.admin
                }
            }));
            client.leave(groupe.id.toString());
            return [dto.event, [groupe.id.toString(), client.id], groupeUpdated];
        }
        catch (error) {
            return ["ERROR", client.id, error];
        }
    }
    async kickUser(dto, client) {
        const user = await this.getUserSocket(client);
        try {
            const user_kick = await this.prisma.user.findUnique({ where: { name: dto.username } });
            const groupe = await this.prisma.groupes.findUnique({ where: { channel_name: dto.channel_name } });
            if (!groupe.members.includes(user_kick.id) ||
                groupe.private_message ||
                groupe.owner == user_kick.id ||
                !groupe.admin.includes(user.id) || (groupe.owner != user.id &&
                groupe.admin.includes(user.id) &&
                groupe.admin.includes(user_kick.id)))
                throw "Not authorized";
            groupe.members.splice(groupe.members.indexOf(user_kick.id), 1);
            if (groupe.admin.includes(user_kick.id))
                groupe.admin.splice(groupe.admin.indexOf(user_kick.id), 1);
            await client.leave(groupe.id.toString());
            const groupeUpdated = (0, class_transformer_1.plainToClass)(chat_entity_1.GroupeEntity, await this.prisma.groupes.update({
                where: {
                    id: groupe.id
                },
                data: {
                    members: groupe.members,
                    admin: groupe.admin
                }
            }));
            return [dto.event, [groupe.id.toString(), client.id], groupeUpdated];
        }
        catch (error) {
            return ["ERROR", client.id, error];
        }
    }
    async banUser(dto, client) {
        const user = await this.getUserSocket(client);
        try {
            const user_ban = await this.prisma.user.findUnique({ where: { name: dto.username } });
            const groupe = await this.prisma.groupes.findUnique({ where: { channel_name: dto.channel_name } });
            if (!groupe.banned.includes(user_ban.id) && (groupe.admin.includes(user.id) &&
                !groupe.admin.includes(user_ban.id)) || groupe.owner == user.id) {
                if (groupe.banned.includes(user_ban.id))
                    throw "Already ban";
                groupe.banned.push(user_ban.id);
                groupe.members.splice(groupe.members.indexOf(user_ban.id), 1);
                if (groupe.admin.includes(user_ban.id) && groupe.owner == user.id)
                    groupe.admin.splice(groupe.members.indexOf(user_ban.id), 1);
                client.leave(groupe.id.toString());
                const groupeUpdated = (0, class_transformer_1.plainToClass)(chat_entity_1.GroupeEntity, await this.prisma.groupes.update({
                    where: {
                        id: groupe.id
                    },
                    data: {
                        banned: groupe.banned,
                        members: groupe.members,
                        admin: groupe.admin
                    }
                }));
                return [dto.event, [groupe.id.toString(), client.id], groupeUpdated];
            }
            else
                throw "Not authorized";
        }
        catch (error) {
            return ["ERROR", client.id, error];
        }
    }
    async unBanUser(dto, client) {
        const user = await this.getUserSocket(client);
        try {
            const user_unban = await this.prisma.user.findUnique({ where: { name: dto.username } });
            const groupe = await this.prisma.groupes.findUnique({ where: { channel_name: dto.channel_name } });
            if (!groupe.members.includes(user.id))
                throw ("Not authorized");
            if (groupe.banned.includes(user_unban.id) && groupe.admin.includes(user.id)) {
                groupe.banned.splice(groupe.banned.indexOf(user_unban.id), 1);
                const groupeUpdated = (0, class_transformer_1.plainToClass)(chat_entity_1.GroupeEntity, await this.prisma.groupes.update({ where: { id: groupe.id }, data: { banned: groupe.banned } }));
                return [dto.event, [groupe.id.toString(), client.id], groupeUpdated];
            }
            if (!groupe.banned.includes(user.id))
                throw ("User not banned");
            throw ("Not authorized");
        }
        catch (error) {
            return ["ERROR", client.id, error];
        }
    }
    async promuteUser(dto, client) {
        const user = await this.getUserSocket(client);
        try {
            const user_promute = await this.prisma.user.findUnique({ where: { name: dto.username } });
            let groupe = await this.prisma.groupes.findUnique({ where: { channel_name: dto.channel_name } });
            if (!groupe.admin.includes(user.id))
                throw ("Not authorized");
            if (groupe.admin.includes(user_promute.id))
                throw ("User already admin");
            if (groupe.admin.includes(user.id) || groupe.owner == user.id) {
                groupe.admin.push(user_promute.id);
                const groupeUpdated = (0, class_transformer_1.plainToClass)(chat_entity_1.GroupeEntity, await this.prisma.groupes.update({
                    where: {
                        id: groupe.id
                    },
                    data: {
                        admin: groupe.admin
                    }
                }));
                return [dto.event, [groupe.id.toString(), client.id], groupeUpdated];
            }
            throw ("Not authorized");
        }
        catch (error) {
            console.log(error);
            return ["ERROR", client.id, error];
        }
    }
    async unPromuteUser(dto, client) {
        const user = await this.getUserSocket(client);
        try {
            const user_unpromute = await this.prisma.user.findUnique({ where: { name: dto.username } });
            const groupe = await this.prisma.groupes.findUnique({ where: { channel_name: dto.channel_name } });
            if (groupe.owner == user.id && groupe.admin.includes(user_unpromute.id) && user_unpromute.id != user.id) {
                groupe.admin.splice(groupe.admin.indexOf(user_unpromute.id), 1);
                const groupeUpdated = (0, class_transformer_1.plainToClass)(chat_entity_1.GroupeEntity, await this.prisma.groupes.update({ where: { id: groupe.id }, data: { admin: groupe.admin } }));
                return [dto.event, [groupe.id.toString(), client.id], groupeUpdated];
            }
            if (!groupe.admin.includes(user_unpromute.id) && user_unpromute.id != user.id)
                throw ("User not admin");
            throw ("Not authorized");
        }
        catch (error) {
            return ["ERROR", client.id, error];
        }
    }
    async messageEvent(client, dto) {
        const id = (await this.getUserSocket(client)).id;
        if (dto.content && dto.id)
            return await this.modifyMessage(dto, id);
        else if (!dto.content && dto.id)
            return await this.deleteMessage(dto, id);
        else
            return await this.postMessage(dto, id);
    }
    async postMessage(dto, id) {
        try {
            const groupe = await this.prisma.groupes.findUnique({ where: { channel_name: dto.channel_name } });
            if (!groupe)
                throw ("groupeNotFound");
            if (!groupe.members.includes(id))
                throw ("userNotAuthorized");
            if (!dto.content)
                return [groupe.id.toString(), ""];
            return [groupe.id.toString(), await this.prisma.messages.create({ data: {
                        sender: id,
                        receiver: groupe.id,
                        content: dto.content
                    } })];
        }
        catch (error) {
            return [id, error];
        }
    }
    async modifyMessage(dto, id) {
        try {
            const groupe = await this.prisma.groupes.findUniqueOrThrow({ where: { channel_name: dto.channel_name } });
            const message = await this.prisma.messages.findUnique({ where: { id: dto.id } });
            if (!groupe)
                throw ("channelNotFound");
            if (!groupe.members.includes(id) || !message || message.sender != id)
                throw ("userNotAuthorized");
            return [groupe.id.toString(), (await this.prisma.messages.update({
                    where: { id: dto.id, sender: id },
                    data: {
                        content: dto.content
                    }
                }))];
        }
        catch (error) {
            return [id, error];
        }
    }
    async deleteMessage(dto, id) {
        try {
            const groupe = await this.prisma.groupes.findUniqueOrThrow({ where: { channel_name: dto.channel_name } });
            const message = await this.prisma.messages.findUniqueOrThrow({ where: { id: dto.id } });
            if (!groupe.members.includes(id) || (message.sender != id && !groupe.admin.includes(id)))
                throw ("userNotAuthorized");
            return [groupe.id.toString(), await this.prisma.messages.delete({ where: { id: dto.id } })];
        }
        catch (error) {
            return [id, error];
        }
    }
    async getUserSocket(client) {
        const jwt = client.handshake.headers.cookies;
        const username = this.jwt.decode(jwt).sub;
        const user = await this.prisma.user.findUnique(({ where: { id: username } }));
        if (!user)
            throw ('User not found');
        return user;
    }
    getPassword(password) {
        return (password == "" ? password : (0, bcrypt_nodejs_1.hashSync)(password, ""));
    }
    async getUsernameJwt(req) {
        const userId = this.jwt.decode(req.headers.authorization.split(" ")[1]).sub;
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        return user.name;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], ChatService);
//# sourceMappingURL=chat.service.js.map