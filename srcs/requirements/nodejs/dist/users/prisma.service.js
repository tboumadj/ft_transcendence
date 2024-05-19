"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt-nodejs");
const Fs = require("fs");
const prisma = new client_1.PrismaClient();
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async createUser(password, name, email, pseudo) {
        password = bcrypt.hashSync(password, "");
        pseudo = name + '42';
        return prisma.user.create({
            data: {
                email,
                name,
                password,
                pseudo,
                avatar: 'avatardefault.jpg',
            },
        });
    }
    async create42User(password, name, email, pseudo, avatar) {
        try {
            return prisma.user.create({
                data: {
                    email,
                    name,
                    password,
                    pseudo,
                    avatar,
                },
            });
        }
        catch (error) {
            console.error('error with new user42');
        }
    }
    async findUserByUsername(username) {
        try {
            return prisma.user.findUnique({
                where: {
                    name: username,
                },
            });
        }
        catch (error) {
            console.error('notfind user');
            return null;
        }
    }
    async findUserById(userId) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        return user || null;
    }
    async updateUser(id, data) {
        return prisma.user.update({
            where: { id },
            data,
        });
    }
    async updatePass(id, data) {
        data.password = bcrypt.hashSync(data.password, "");
        return prisma.user.update({
            where: { id },
            data,
        });
    }
    async updateAv(id, data) {
        return prisma.user.update({
            where: { id },
            data,
        });
    }
    async update2FA(id, data) {
        return prisma.user.update({
            where: { id },
            data,
        });
    }
    async deleteAv(id) {
        const user = await this.findUserById(id);
        const img_name = user.avatar;
        if (img_name == 'avatardefault.jpg') {
            return null;
        }
        else {
            Fs.rm('./uploadAvatar/' + img_name, (err) => { if (err) {
                throw err;
            } });
            await this.updateAv(id, { avatar: 'avatardefault.jpg' });
        }
    }
    async addFriend(userId, friendId) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                friends: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const isFriendAlreadyAdded = user.friends.includes(friendId);
        if (isFriendAlreadyAdded) {
            throw new Error('Friend already exists in the list');
        }
        const updatedFriends = [...user.friends, friendId];
        const friendsAsNumbers = updatedFriends.map(friend => Number(friend));
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                friends: friendsAsNumbers,
            },
        });
    }
    async removeFriend(userId, friendId) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const updatedFriends = user.friends.filter(id => id !== friendId);
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                friends: updatedFriends,
            },
        });
    }
    async getFriends(userId) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                friends: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user.friends;
    }
    async updateInvMess(id) {
        return await prisma.user.update({
            where: { id },
            data: { haveMessage: true },
        });
    }
    async updateInvMessToFalse(id) {
        return await prisma.user.update({
            where: { id },
            data: { haveMessage: false },
        });
    }
    async updateInvitation(id) {
        return await prisma.user.update({
            where: { id },
            data: { haveInvitation: true },
        });
    }
    async updateInvitationToFalse(id) {
        return await prisma.user.update({
            where: { id },
            data: { haveInvitation: false },
        });
    }
    async updateOnLine(id) {
        return await prisma.user.update({
            where: { id },
            data: { onLine: true },
        });
    }
    async updateOffLine(id) {
        return await prisma.user.update({
            where: { id },
            data: { onLine: false },
        });
    }
    async updateInGame(id) {
        return await prisma.user.update({
            where: { id },
            data: { inGame: true },
        });
    }
    async updateOutGame(id) {
        return await prisma.user.update({
            where: { id },
            data: { inGame: false },
        });
    }
    quickFix(user) {
        if (!user)
            return undefined;
        if (!(user.wins >= 0))
            user.wins = 0;
        if (!(user.lose >= 0))
            user.lose = 0;
        return user;
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map