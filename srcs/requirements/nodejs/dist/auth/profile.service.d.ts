import { PrismaService } from "src/users/prisma.service";
export declare class ProfileService {
    private prismaService;
    constructor(prismaService: PrismaService);
    getProfileData(userId: any): Promise<{
        id: number;
        username: string;
        email: string;
        pseudo: string;
        avatar: string;
        twoFactorAuth: boolean;
        twofvalidated: boolean;
        friends: number[];
    }>;
    getProfilInvit(userId: any): Promise<boolean>;
    getProfilMessage(userId: any): Promise<boolean>;
    getProfilePublicData(userId: any): Promise<{
        id: number;
        username: string;
        email: string;
        pseudo: string;
        avatar: string;
        friends: number[];
    }>;
    getProfileFriend(userId: any): Promise<number[]>;
    getProfileList(userId: any): Promise<{
        id: number;
        username: string;
        pseudo: string;
        avatar: string;
    }>;
}
