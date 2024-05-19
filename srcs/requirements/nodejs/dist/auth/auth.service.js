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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../users/prisma.service");
const bcrypt = require("bcrypt-nodejs");
const Fs = require("fs");
const crypto_1 = require("crypto");
const Https = require("https");
const twof_auth_guard_1 = require("./twof-auth.guard");
let AuthService = class AuthService {
    constructor(prismaService, jwtService, myTwoFmiddle) {
        this.prismaService = prismaService;
        this.jwtService = jwtService;
        this.myTwoFmiddle = myTwoFmiddle;
    }
    async validateUser(name, password) {
        const user = await this.prismaService.findUserByUsername(name);
        if (user && bcrypt.compareSync(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const check = await this.myTwoFmiddle.use(user);
        const payload = { name: user.name, sub: user.id };
        if (check == false) {
            console.log('Falselogin');
            return {
                success: false,
                message: '2FA needed',
                userId: user.id,
            };
        }
        else if (check == true) {
            return {
                success: true,
                token: this.jwtService.sign(payload),
            };
        }
    }
    async getAccesToken42(code) {
        try {
            const response = await fetch('https://api.intra.42.fr/oauth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code,
                    client_id: 'u-s4t2ud-c2e8bc52e0fa0828fe21bdc65d9737036e07bd1c9f7af2fd6a26828eb613d764',
                    client_secret: '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',
                    redirect_uri: 'http://localhost:3000/api/auth/fetchProfile42',
                    grant_type: 'authorization_code',
                }),
            });
            const responseData = await response.json();
            return responseData.access_token;
        }
        catch (error) {
            console.log("error fetch user data..");
        }
    }
    async fetchInfo42(token) {
        try {
            const auth_header = "Bearer " + token;
            const req_user = await fetch("https://api.intra.42.fr/v2/me", {
                method: "GET",
                headers: {
                    "Authorization": auth_header,
                }
            });
            return (req_user.json());
        }
        catch (error) {
            console.log('erreur with fetch info user42');
        }
    }
    async createUser42(user42) {
        try {
            const img_name = (0, crypto_1.randomBytes)(16).toString('hex') + user42.image.link.slice(user42.image.link.lastIndexOf('.'));
            const password = bcrypt.hashSync("user42password", "");
            const pseudo = user42.login + "#42";
            const file = Fs.createWriteStream("./uploadAvatar/" + img_name);
            Https.get(user42.image.link, response => {
                response.pipe(file);
                file.on('finish', () => { file.close(); });
            });
            const newUser = await this.prismaService.create42User(password, user42.login, user42.email, pseudo, img_name);
            return newUser;
        }
        catch (error) {
            console.log("error with create user42");
        }
    }
    getSuccess(user, jwt) {
        return `<script>
              window.opener.postMessage({ 
              type: '42auth-success', 
              user: JSON.stringify(${user}),
              jwt: '${jwt}'    
                    }, '*');
                </script>`;
    }
    getError(user) {
        return `<script>
              window.opener.postMessage({ 
              type: '42auth-false', 
              user: JSON.stringify(${user}),
                    }, '*');
                </script>`;
    }
    getSuccess2fa(user, uri) {
        return `<script>
              window.opener.postMessage({ 
              type: '2faAuth-success', 
              user: JSON.stringify(${user}),
              uri: '${uri}'    
                    }, '*');
                </script>`;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        twof_auth_guard_1.TwofMiddleware])
], AuthService);
//# sourceMappingURL=auth.service.js.map