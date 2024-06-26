"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("../auth/jwt.strategy");
const prisma_service_1 = require("./prisma.service");
const auth_service_1 = require("../auth/auth.service");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const profile_service_1 = require("../auth/profile.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const twof_auth_guard_1 = require("../auth/twof-auth.guard");
let PrismaModule = class PrismaModule {
    configure(consumer) {
        consumer.apply(jwt_auth_guard_1.AuthMiddleware).forRoutes('update');
    }
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: 'boumboum',
                signOptions: { expiresIn: '1h' },
            }),
            PrismaModule,
        ],
        providers: [auth_service_1.AuthService, prisma_service_1.PrismaService, profile_service_1.ProfileService, users_service_1.UsersService, twof_auth_guard_1.TwofMiddleware, jwt_auth_guard_1.AuthMiddleware, jwt_strategy_1.JwtStrategy],
        exports: [prisma_service_1.PrismaService],
        controllers: [users_controller_1.UsersController, users_controller_1.UpdatePController],
    })
], PrismaModule);
//# sourceMappingURL=prisma.module.js.map