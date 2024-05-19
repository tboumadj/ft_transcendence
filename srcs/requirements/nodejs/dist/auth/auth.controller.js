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
exports.ProfileController = exports.JwtController = exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
let UID42 = process.env["UID42"];
let PROFILE42 = process.env["PROFILE42"];
let SECRET42 = process.env["SECRET42"];
const otplib = require("otplib");
const auth_service_1 = require("./auth.service");
const prisma_service_1 = require("../users/prisma.service");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const profile_service_1 = require("./profile.service");
const users_service_1 = require("../users/users.service");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
let AuthController = class AuthController {
    constructor(authService, prismaService, usersService) {
        this.authService = authService;
        this.prismaService = prismaService;
        this.usersService = usersService;
    }
    async login(req) {
        const { name, password } = req.body;
        if (!name || !password) {
            throw new common_1.UnauthorizedException('Missing Credentials!');
        }
        const user = await this.authService.validateUser(name, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }
    async trustlogin(req) {
        const userId = +req.body.userId;
        const user = await this.prismaService.findUserById(userId);
        return this.authService.login(user);
    }
    async generate2FA(req) {
        const userId = req.query.userId;
        const id = +userId;
        const secret = otplib.authenticator.generateSecret();
        const user = await this.prismaService.findUserById(id);
        await this.prismaService.update2FA(id, { twofsecret: secret });
        const uri = otplib.authenticator.keyuri(user.name, 'Trispong', secret);
        return { success: true, userId: id, uri: uri };
    }
    async verify2fa(req) {
        const userId = +req.query.userId;
        const testCode = req.query.code;
        const user = await this.prismaService.findUserById(userId);
        const serverGeneratedCode = otplib.authenticator.generate(user.twofsecret);
        if (testCode === serverGeneratedCode) {
            console.log('Authentification à deux facteurs réussie');
            await this.usersService.validate2fa(userId);
            return { success: true, userId: userId, valid2fa: user.twofvalidated };
        }
        else {
            console.log('Échec de l\'authentification à deux facteurs');
            return { success: false };
        }
    }
    notuUsedFunc() { }
    async fetchProfile42(req, res) {
        const access_token = await this.authService.getAccesToken42(req.query.code);
        const user42 = await this.authService.fetchInfo42(access_token);
        const search = await this.prismaService.findUserByUsername(user42.login);
        if (!search) {
            const newUser = await this.authService.createUser42(user42);
            const resp = await this.authService.login(newUser);
            if (resp.success == false) {
                res.type('text/html').send(this.authService.getError(JSON.stringify(resp.userId)));
            }
            res.type('text/html').send(this.authService.getSuccess(JSON.stringify(resp.success), resp.token));
        }
        else {
            const resp2 = await this.authService.login(search);
            if (resp2.success == false) {
                res.type('text/html').send(this.authService.getError(JSON.stringify(resp2.userId)));
            }
            else {
                res.type('text/html').send(this.authService.getSuccess(JSON.stringify(resp2.success), resp2.token));
            }
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('trustlogin'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "trustlogin", null);
__decorate([
    (0, common_1.Get)('2FAdir'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generate2FA", null);
__decorate([
    (0, common_1.Get)('verify2fa'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify2fa", null);
__decorate([
    (0, common_1.Get)('42login'),
    (0, common_1.Redirect)('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c2e8bc52e0fa0828fe21bdc65d9737036e07bd1c9f7af2fd6a26828eb613d764&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2FfetchProfile42&response_type=code'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "notuUsedFunc", null);
__decorate([
    (0, common_1.Get)('fetchProfile42'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "fetchProfile42", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        prisma_service_1.PrismaService,
        users_service_1.UsersService])
], AuthController);
let JwtController = class JwtController {
    async getResource(req) {
        return { token: req.user, success: true };
    }
};
exports.JwtController = JwtController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthMiddleware),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JwtController.prototype, "getResource", null);
exports.JwtController = JwtController = __decorate([
    (0, common_1.Controller)('auth/checkJWT')
], JwtController);
let ProfileController = class ProfileController {
    constructor(profileService) {
        this.profileService = profileService;
    }
    async getProfile(req) {
        try {
            const userId = (req.user);
            if (!userId) {
                throw new Error('ID utilisateur non défini dans la requête');
            }
            const profileData = this.profileService.getProfileData(userId);
            return profileData;
        }
        catch (error) {
            console.error('Erreur lors de la récupération des données du profil', error);
            throw new Error('Erreur lors de la récupération des données du profil');
        }
    }
    async getProfilePublic(req) {
        try {
            const userId = (req.user);
            const FriendId = +req.query.userId;
            if (!userId) {
                throw new Error('ID utilisateur non défini dans la requête');
            }
            const profileData = this.profileService.getProfilePublicData(FriendId);
            return profileData;
        }
        catch (error) {
            console.error('Erreur lors de la récupération des données du profil', error);
            throw new Error('Erreur lors de la récupération des données du profil');
        }
    }
    async getInvit(req) {
        try {
            const userId = (req.user);
            if (!userId) {
                throw new Error('ID utilisateur non défini dans la requête');
            }
            const profileData = this.profileService.getProfilInvit(userId);
            return profileData;
        }
        catch (error) {
            console.error('Erreur lors de la récupération des données du profil', error);
            throw new Error('Erreur lors de la récupération des données du profil');
        }
    }
    async getMess(req) {
        try {
            const userId = (req.user);
            if (!userId) {
                throw new Error('ID utilisateur non défini dans la requête');
            }
            const profileData = this.profileService.getProfilMessage(userId);
            return profileData;
        }
        catch (error) {
            console.error('Erreur lors de la récupération des données du profil', error);
            throw new Error('Erreur lors de la récupération des données du profil');
        }
    }
    async getProfileFriend(req) {
        try {
            const userId = +req.user;
            if (!userId) {
                throw new Error('ID not defined');
            }
            const result = await this.profileService.getProfileFriend(userId);
            let user = [];
            for (let i = 0; i < result.length; i++) {
                const profile = await this.profileService.getProfileList(result[i]);
                user.push(profile);
            }
            return user;
        }
        catch (error) {
            console.error('erreur lors de la friendlist');
        }
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthMiddleware),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('/friend'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthMiddleware),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfilePublic", null);
__decorate([
    (0, common_1.Get)('/invit'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthMiddleware),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getInvit", null);
__decorate([
    (0, common_1.Get)('/message'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthMiddleware),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getMess", null);
__decorate([
    (0, common_1.Get)('/friendlist'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthMiddleware),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfileFriend", null);
exports.ProfileController = ProfileController = __decorate([
    (0, common_1.Controller)('auth/profile'),
    __metadata("design:paramtypes", [profile_service_1.ProfileService])
], ProfileController);
//# sourceMappingURL=auth.controller.js.map