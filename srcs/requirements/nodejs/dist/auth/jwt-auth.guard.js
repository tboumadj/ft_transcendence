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
exports.AuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const jwt_strategy_1 = require("./jwt.strategy");
let AuthMiddleware = class AuthMiddleware {
    constructor(jwtStrategy) {
        this.jwtStrategy = jwtStrategy;
    }
    async use(req, res, next) {
        try {
            const str = req.header('Authorization');
            const test = str.split(' ');
            const jwt = test[1];
            const secret = 'boumboum';
            const jeton = require('jsonwebtoken');
            const decoded = jeton.verify(jwt, secret);
            req.user = decoded.sub;
            next();
        }
        catch (err) {
            res.status(401).json({ message: 'Token invalid or expired.' });
        }
    }
};
exports.AuthMiddleware = AuthMiddleware;
exports.AuthMiddleware = AuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_strategy_1.JwtStrategy])
], AuthMiddleware);
//# sourceMappingURL=jwt-auth.guard.js.map