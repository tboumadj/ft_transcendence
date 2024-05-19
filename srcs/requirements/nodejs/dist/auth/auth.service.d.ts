import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../users/prisma.service';
import { TwofMiddleware } from './twof-auth.guard';
export declare class AuthService {
    private prismaService;
    private jwtService;
    private readonly myTwoFmiddle;
    constructor(prismaService: PrismaService, jwtService: JwtService, myTwoFmiddle: TwofMiddleware);
    validateUser(name: string, password: string): Promise<any>;
    login(user: any): Promise<{
        success: boolean;
        message: string;
        userId: any;
        token?: undefined;
    } | {
        success: boolean;
        token: string;
        message?: undefined;
        userId?: undefined;
    }>;
    getAccesToken42(code: string): Promise<any>;
    fetchInfo42(token: string): Promise<any>;
    createUser42(user42: any): Promise<any>;
    getSuccess(user: string, jwt: string): string;
    getError(user: any): string;
    getSuccess2fa(user: any, uri: string): string;
}
