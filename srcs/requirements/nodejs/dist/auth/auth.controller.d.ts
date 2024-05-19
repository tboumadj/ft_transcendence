/// <reference types="passport" />
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/users/prisma.service';
import { ProfileService } from './profile.service';
import { UsersService } from 'src/users/users.service';
export declare class AuthController {
    private authService;
    private prismaService;
    private usersService;
    constructor(authService: AuthService, prismaService: PrismaService, usersService: UsersService);
    login(req: ExpressRequest): Promise<{
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
    trustlogin(req: ExpressRequest): Promise<{
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
    generate2FA(req: any): Promise<{
        success: boolean;
        userId: number;
        uri: string;
    }>;
    verify2fa(req: any): Promise<{
        success: boolean;
        userId: number;
        valid2fa: boolean;
    } | {
        success: boolean;
        userId?: undefined;
        valid2fa?: undefined;
    }>;
    notuUsedFunc(): void;
    fetchProfile42(req: any, res: any): Promise<void>;
}
export declare class JwtController {
    getResource(req: ExpressRequest): Promise<{
        token: Express.User;
        success: boolean;
    }>;
}
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getProfile(req: ExpressRequest): Promise<{
        id: number;
        username: string;
        email: string;
        pseudo: string;
        avatar: string;
        twoFactorAuth: boolean;
        twofvalidated: boolean;
        friends: number[];
    }>;
    getProfilePublic(req: any): Promise<{
        id: number;
        username: string;
        email: string;
        pseudo: string;
        avatar: string;
        friends: number[];
    }>;
    getInvit(req: any): Promise<boolean>;
    getMess(req: any): Promise<boolean>;
    getProfileFriend(req: any): Promise<any[]>;
}
