import { Socket } from 'socket.io';
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
export declare class StatusService {
    private jwt;
    private prisma;
    private clients;
    constructor(jwt: JwtService, prisma: PrismaService);
    handleconnection(client: Socket): Promise<void>;
    handledisconnect(client: Socket): Promise<void>;
    getUserSocket(client: Socket): Promise<{
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
    setOnLine(client: Socket): Promise<void>;
    setOffLine(client: Socket): Promise<void>;
    setInGame(client: Socket): Promise<void>;
    setInChat(client: Socket): Promise<void>;
    getStatus(): string;
}
