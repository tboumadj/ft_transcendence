import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtStrategy } from './jwt.strategy';
export declare class AuthMiddleware implements NestMiddleware {
    private readonly jwtStrategy;
    constructor(jwtStrategy: JwtStrategy);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
    validate(token: any): Promise<any>;
}
