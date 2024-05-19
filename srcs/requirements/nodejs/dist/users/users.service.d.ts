/// <reference types="multer" />
import { PrismaService } from "./prisma.service";
export declare class UsersService {
    private prismaService;
    constructor(prismaService: PrismaService);
    updateUserPseudo(userId: any, newPseudo: string): Promise<{
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
    updateUserPass(userId: any, newPassword: string): Promise<{
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
    checkOldPass(userId: any, oldPassword: string): Promise<0 | 1>;
    updateAvatar(file: Express.Multer.File, userId: any): Promise<void>;
    updateAvatarUrl(imageUrl: string, userId: any): Promise<void>;
    enableTwoFactor(userId: any, value: boolean): Promise<void>;
    validate2fa(userId: any): Promise<void>;
    disconnect2fa(userId: any): Promise<void>;
}
