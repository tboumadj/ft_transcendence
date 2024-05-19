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
exports.UpdatePController = exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const users_service_1 = require("./users.service");
const profile_service_1 = require("../auth/profile.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
let UsersController = class UsersController {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async createUser(createUserDto) {
        const { password, name, email, pseudo } = createUserDto;
        const newUser = await this.prismaService.createUser(password, name, email, pseudo);
        if (newUser.statusCode) {
            return null;
        }
        else {
            const Response = { succes: true, name };
            return Response;
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersController);
let UpdatePController = class UpdatePController {
    constructor(usersService, prismaService, profileService) {
        this.usersService = usersService;
        this.prismaService = prismaService;
        this.profileService = profileService;
    }
    async FriendForLife(req, friend) {
        const userId = +req.user;
        const friendId = +friend;
        await this.prismaService.addFriend(userId, friendId);
        const friends = await this.prismaService.getFriends(userId);
        return { success: true, friendlist: friends };
    }
    async deleteFriend(req, friend) {
        const userId = +req.user;
        const friendId = +friend;
        await this.prismaService.removeFriend(userId, friendId);
        const friends = await this.prismaService.getFriends(userId);
        return { success: true, friendlist: friends };
    }
    async checkForAdd(req, friend_search) {
        const userId = +req.user;
        const me = await this.prismaService.findUserById(userId);
        const friend = await this.prismaService.findUserByUsername(friend_search);
        if (friend) {
            if (me.id !== friend.id) {
                const userFriend = await this.profileService.getProfilePublicData(friend.id);
                return { success: true, message: 'User find', userFriend };
            }
            else {
                return { success: false, message: 'U cant search yourself' };
            }
        }
        else {
            return { success: false, message: 'User doesnt exist' };
        }
    }
    async updateUserPseudo(req, newPseudo) {
        const userId = (req.user);
        return this.usersService.updateUserPseudo(userId, newPseudo);
    }
    async updateUserPass(req, newPassword, oldPassword) {
        const userId = (req.user);
        const resp = await this.usersService.checkOldPass(userId, oldPassword);
        if (resp === 1) {
            return this.usersService.updateUserPass(userId, newPassword);
        }
        else {
            return null;
        }
    }
    async checkTwoFactor(req, valueTF) {
        try {
            const userId = +req.user;
            this.usersService.enableTwoFactor(userId, valueTF);
            const user = await this.prismaService.findUserById(userId);
            return { success: true, userId: userId, value2f: valueTF, valid2f: user.twofvalidated };
        }
        catch (error) {
            console.log('Error with check 2FA');
            return { success: false };
        }
    }
    async disable2fa(req) {
        try {
            const userId = +req.user;
            this.usersService.disconnect2fa(userId);
            const user = await this.prismaService.findUserById(userId);
            return { success: true, userId: userId, value2f: user.twoFactorAuth, valid2f: user.twofvalidated };
        }
        catch (error) {
            console.log('Error with check 2FA');
            return { success: false };
        }
    }
    updateAvatar(file, req) {
        try {
            const userId = (req.user);
            this.usersService.updateAvatar(file, userId);
            return { success: true, message: 'Fichier téléchargé avec succès.' };
        }
        catch (error) {
            console.error('Error uploadAvatar : ', error);
        }
    }
    async updateAvatarUrl(body, req) {
        try {
            const userId = (req.user);
            const imageUrl = body.imageUrl;
            await this.usersService.updateAvatarUrl(imageUrl, userId);
            return { success: true, message: 'Fichier téléchargé avec succès.' };
        }
        catch (error) {
            console.error('Error uploadAvatarUrl : ', error);
        }
    }
    async updateResetInvit(req) {
        const userId = (+req.user);
        return this.prismaService.updateInvitationToFalse(userId);
    }
    async updateInvMessage(body) {
        const frindId = (+body.frind_id);
        return this.prismaService.updateInvMess(frindId);
    }
    async ResInvMessage(req) {
        const userId = (+req.user);
        return this.prismaService.updateInvMessToFalse(userId);
    }
};
exports.UpdatePController = UpdatePController;
__decorate([
    (0, common_1.Put)('addFriend'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthMiddleware),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('friend')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UpdatePController.prototype, "FriendForLife", null);
__decorate([
    (0, common_1.Put)('deleteFriend'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthMiddleware),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('friend')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UpdatePController.prototype, "deleteFriend", null);
__decorate([
    (0, common_1.Put)('searchUser'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthMiddleware),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('friend_search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UpdatePController.prototype, "checkForAdd", null);
__decorate([
    (0, common_1.Put)('Name'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthMiddleware),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('pseudo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UpdatePController.prototype, "updateUserPseudo", null);
__decorate([
    (0, common_1.Put)('Pass'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthMiddleware),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('password')),
    __param(2, (0, common_1.Body)('testpass')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UpdatePController.prototype, "updateUserPass", null);
__decorate([
    (0, common_1.Put)('checkTwoF'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthMiddleware),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('value')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean]),
    __metadata("design:returntype", Promise)
], UpdatePController.prototype, "checkTwoFactor", null);
__decorate([
    (0, common_1.Get)('disable2fa'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthMiddleware),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UpdatePController.prototype, "disable2fa", null);
__decorate([
    (0, common_1.Post)('UploadAvatar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthMiddleware),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 5000000 }),
            new common_1.FileTypeValidator({ fileType: 'image/jpeg' })
        ]
    }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UpdatePController.prototype, "updateAvatar", null);
__decorate([
    (0, common_1.Post)('UploadAvatarUrl'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthMiddleware),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UpdatePController.prototype, "updateAvatarUrl", null);
__decorate([
    (0, common_1.Get)('ResInv'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthMiddleware),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UpdatePController.prototype, "updateResetInvit", null);
__decorate([
    (0, common_1.Post)('InvMess'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthMiddleware),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UpdatePController.prototype, "updateInvMessage", null);
__decorate([
    (0, common_1.Get)('ResMess'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthMiddleware),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UpdatePController.prototype, "ResInvMessage", null);
exports.UpdatePController = UpdatePController = __decorate([
    (0, common_1.Controller)('update'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        prisma_service_1.PrismaService,
        profile_service_1.ProfileService])
], UpdatePController);
//# sourceMappingURL=users.controller.js.map