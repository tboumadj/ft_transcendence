import { GameService } from "./game.service";
import { Request as ExpressRequest } from 'express';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    getAllHistories(req: ExpressRequest): Promise<any>;
}
