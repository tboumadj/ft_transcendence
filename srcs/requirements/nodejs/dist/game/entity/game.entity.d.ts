import { User } from "@prisma/client";
export declare class Game {
    id: number;
    p1: User;
    p2: User;
    scorP1: number;
    scorP2: number;
    playedOn: Date;
}
