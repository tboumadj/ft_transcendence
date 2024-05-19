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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const bcrypt = require("bcrypt-nodejs");
const Fs = require("fs");
const crypto_1 = require("crypto");
const Https = require("https");
let UsersService = class UsersService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async updateUserPseudo(userId, newPseudo) {
        return this.prismaService.updateUser(userId, { pseudo: newPseudo });
    }
    async updateUserPass(userId, newPassword) {
        return this.prismaService.updatePass(userId, { password: newPassword });
    }
    async checkOldPass(userId, oldPassword) {
        const user = await this.prismaService.findUserById(userId);
        if (user && bcrypt.compareSync(oldPassword, user.password)) {
            return (1);
        }
        return (0);
    }
    async updateAvatar(file, userId) {
        const new_img = (0, crypto_1.randomBytes)(16).toString('hex') + '.jpg';
        Fs.writeFile('./uploadAvatar/' + new_img, file.buffer, (err) => { if (err) {
            throw err;
        } });
        await this.prismaService.deleteAv(userId);
        await this.prismaService.updateAv(userId, { avatar: new_img });
    }
    async updateAvatarUrl(imageUrl, userId) {
        const img_name = (0, crypto_1.randomBytes)(16).toString('hex') + imageUrl.slice(imageUrl.lastIndexOf('.'));
        const file = Fs.createWriteStream("./uploadAvatar/" + img_name);
        Https.get(imageUrl, response => {
            response.pipe(file);
            file.on('finish', () => { file.close(); });
        });
        await this.prismaService.updateAv(userId, { avatar: img_name });
    }
    async enableTwoFactor(userId, value) {
        try {
            const user = await this.prismaService.findUserById(userId);
            if (user.twoFactorAuth == false && value == true) {
                await this.prismaService.update2FA(userId, { twoFactorAuth: value });
            }
            else if (value == false && user.twoFactorAuth == true) {
                await this.prismaService.update2FA(userId, { twoFactorAuth: value });
            }
        }
        catch (error) {
            console.error('Error with enable 2FA');
        }
    }
    async validate2fa(userId) {
        try {
            await this.prismaService.update2FA(userId, { twofvalidated: true });
        }
        catch (error) {
            console.error('Error with validating 2fa');
        }
    }
    async disconnect2fa(userId) {
        try {
            await this.prismaService.update2FA(userId, { twofvalidated: false });
        }
        catch (error) {
            console.error('Error with unvalidating 2fa');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map