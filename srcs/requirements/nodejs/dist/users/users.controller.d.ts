/// <reference types="multer" />
import { Request as ExpressRequest } from 'express';
import { PrismaService } from './prisma.service';
import { UsersService } from './users.service';
import { ProfileService } from '../auth/profile.service';
export declare class UsersController {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    createUser(createUserDto: {
        password?: string;
        name?: string;
        email?: string;
        pseudo?: string;
    }): Promise<any>;
}
export declare class UpdatePController {
    private readonly usersService;
    private prismaService;
    private profileService;
    constructor(usersService: UsersService, prismaService: PrismaService, profileService: ProfileService);
    FriendForLife(req: ExpressRequest, friend: number): Promise<{
        success: boolean;
        friendlist: number[];
    }>;
    deleteFriend(req: ExpressRequest, friend: number): Promise<{
        success: boolean;
        friendlist: number[];
    }>;
    checkForAdd(req: ExpressRequest, friend_search: string): Promise<{
        success: boolean;
        message: string;
        userFriend: {
            id: number;
            username: string;
            email: string;
            pseudo: string;
            avatar: string;
            friends: number[];
        };
    } | {
        success: boolean;
        message: string;
        userFriend?: undefined;
    }>;
    updateUserPseudo(req: ExpressRequest, newPseudo: string): Promise<{
        id: number;
        name: string;
        password: string;
        email: string;
        pseudo: string;
        avatar: string;
        twoFactorAuth: boolean;
        twofvalidated: boolean;
        twofsecret: string;
        friends: number[];
        blocked: number[];
        onLine: boolean;
        inGame: boolean;
        haveInvitation: boolean;
        haveMessage: boolean;
        matchs: number;
        wins: number;
        lose: number;
    }>;
    updateUserPass(req: ExpressRequest, newPassword: string, oldPassword: string): Promise<{
        id: number;
        name: string;
        password: string;
        email: string;
        pseudo: string;
        avatar: string;
        twoFactorAuth: boolean;
        twofvalidated: boolean;
        twofsecret: string;
        friends: number[];
        blocked: number[];
        onLine: boolean;
        inGame: boolean;
        haveInvitation: boolean;
        haveMessage: boolean;
        matchs: number;
        wins: number;
        lose: number;
    }>;
    checkTwoFactor(req: ExpressRequest, valueTF: boolean): Promise<{
        success: boolean;
        userId: number;
        value2f: boolean;
        valid2f: boolean;
    } | {
        success: boolean;
        userId?: undefined;
        value2f?: undefined;
        valid2f?: undefined;
    }>;
    disable2fa(req: ExpressRequest): Promise<{
        success: boolean;
        userId: number;
        value2f: boolean;
        valid2f: boolean;
    } | {
        success: boolean;
        userId?: undefined;
        value2f?: undefined;
        valid2f?: undefined;
    }>;
    updateAvatar(file: Express.Multer.File, req: ExpressRequest): {
        success: boolean;
        message: string;
    };
    updateAvatarUrl(body: {
        imageUrl: string;
    }, req: ExpressRequest): Promise<{
        success: boolean;
        message: string;
    }>;
    updateResetInvit(req: ExpressRequest): Promise<{
        id: number;
        name: string;
        password: string;
        email: string;
        pseudo: string;
        avatar: string;
        twoFactorAuth: boolean;
        twofvalidated: boolean;
        twofsecret: string;
        friends: number[];
        blocked: number[];
        onLine: boolean;
        inGame: boolean;
        haveInvitation: boolean;
        haveMessage: boolean;
        matchs: number;
        wins: number;
        lose: number;
    }>;
    updateInvMessage(body: {
        frind_id: number;
    }): Promise<{
        id: number;
        name: string;
        password: string;
        email: string;
        pseudo: string;
        avatar: string;
        twoFactorAuth: boolean;
        twofvalidated: boolean;
        twofsecret: string;
        friends: number[];
        blocked: number[];
        onLine: boolean;
        inGame: boolean;
        haveInvitation: boolean;
        haveMessage: boolean;
        matchs: number;
        wins: number;
        lose: number;
    }>;
    ResInvMessage(req: ExpressRequest): Promise<{
        id: number;
        name: string;
        password: string;
        email: string;
        pseudo: string;
        avatar: string;
        twoFactorAuth: boolean;
        twofvalidated: boolean;
        twofsecret: string;
        friends: number[];
        blocked: number[];
        onLine: boolean;
        inGame: boolean;
        haveInvitation: boolean;
        haveMessage: boolean;
        matchs: number;
        wins: number;
        lose: number;
    }>;
}
