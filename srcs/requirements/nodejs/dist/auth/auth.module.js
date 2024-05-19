"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("./auth.service");
const local_strategy_1 = require("./local.strategy");
const jwt_strategy_1 = require("./jwt.strategy");
const auth_controller_1 = require("./auth.controller");
const prisma_module_1 = require("../users/prisma.module");
const local_auth_guard_1 = require("./local-auth.guard");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const twof_auth_guard_1 = require("./twof-auth.guard");
const profile_service_1 = require("./profile.service");
const users_service_1 = require("../users/users.service");
let AuthModule = class AuthModule {
    configure(consumer) {
        consumer.apply(jwt_auth_guard_1.AuthMiddleware).forRoutes('auth/profile');
        consumer.apply(jwt_auth_guard_1.AuthMiddleware).forRoutes('auth/checkJWT');
    }
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: 'boumboum',
                signOptions: { expiresIn: '1h' },
            }),
            prisma_module_1.PrismaModule,
        ],
        controllers: [auth_controller_1.AuthController, auth_controller_1.JwtController, auth_controller_1.ProfileController],
        providers: [auth_service_1.AuthService, users_service_1.UsersService, profile_service_1.ProfileService, local_auth_guard_1.LocalAuthGuard, jwt_auth_guard_1.AuthMiddleware, twof_auth_guard_1.TwofMiddleware, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map