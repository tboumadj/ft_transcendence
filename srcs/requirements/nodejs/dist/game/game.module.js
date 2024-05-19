"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModule = void 0;
const common_1 = require("@nestjs/common");
const game_gateway_1 = require("./game.gateway");
const game_service_1 = require("./game.service");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../users/prisma.service");
const game_controller_1 = require("./game.controller");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const jwt_strategy_1 = require("./jwt.strategy");
const auth_service_1 = require("../auth/auth.service");
const twof_auth_guard_1 = require("../auth/twof-auth.guard");
const auth_module_1 = require("../auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
let GameModule = class GameModule {
};
exports.GameModule = GameModule;
exports.GameModule = GameModule = __decorate([
    (0, common_1.Module)({
        controllers: [game_controller_1.GameController],
        providers: [game_gateway_1.default, game_service_1.GameService, prisma_service_1.PrismaService, twof_auth_guard_1.TwofMiddleware, config_1.ConfigService, auth_service_1.AuthService, jwt_auth_guard_1.AuthMiddleware, jwt_strategy_1.JwtStrategy, jwt_1.JwtService],
        exports: [game_gateway_1.default, game_service_1.GameService],
        imports: [auth_module_1.AuthModule],
    })
], GameModule);
//# sourceMappingURL=game.module.js.map