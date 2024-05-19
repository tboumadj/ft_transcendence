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
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../users/prisma.service");
let ProfileService = class ProfileService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async getProfileData(userId) {
        try {
            const user = await this.prismaService.findUserById(userId);
            if (!user) {
                return null;
            }
            const profileData = {
                id: user.id,
                username: user.name,
                email: user.email,
                pseudo: user.pseudo,
                avatar: user.avatar,
                twoFactorAuth: user.twoFactorAuth,
                twofvalidated: user.twofvalidated,
                friends: user.friends,
            };
            return profileData;
        }
        catch (error) {
            console.error('Error for profile data');
            throw new Error('Error for profile data');
        }
    }
    async getProfilInvit(userId) {
        try {
            const user = await this.prismaService.findUserById(userId);
            if (!user) {
                return null;
            }
            if (user.haveInvitation === true) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            console.error('Cannot look my invitation', error);
        }
    }
    async getProfilMessage(userId) {
        try {
            const user = await this.prismaService.findUserById(userId);
            if (!user) {
                return null;
            }
            if (user.haveMessage === true) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            console.error('Cannot look my invitation', error);
        }
    }
    async getProfilePublicData(userId) {
        try {
            const user = await this.prismaService.findUserById(userId);
            if (!user) {
                return null;
            }
            const profileData = {
                id: user.id,
                username: user.name,
                email: user.email,
                pseudo: user.pseudo,
                avatar: user.avatar,
                friends: user.friends,
            };
            return profileData;
        }
        catch (error) {
            console.error('Error for profile data');
            throw new Error('Error for profile data');
        }
    }
    async getProfileFriend(userId) {
        try {
            const user = await this.prismaService.findUserById(userId);
            if (!user) {
                return null;
            }
            const result = user.friends;
            return result;
        }
        catch (error) {
            console.error('error for profile data');
        }
    }
    async getProfileList(userId) {
        try {
            const user = await this.prismaService.findUserById(userId);
            if (!user) {
                return null;
            }
            const profileData = {
                id: user.id,
                username: user.name,
                pseudo: user.pseudo,
                avatar: user.avatar,
            };
            return profileData;
        }
        catch (error) {
            console.error('Error for profile data');
            throw new Error('Error for profile data');
        }
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfileService);
//# sourceMappingURL=profile.service.js.map