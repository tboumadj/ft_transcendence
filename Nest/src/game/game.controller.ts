import { Controller, Get, Request } from "@nestjs/common";
import { GameService } from "./game.service";
import { Request as ExpressRequest} from 'express';



@Controller('game')
export class GameController {
  constructor(
              private readonly gameService: GameService,
            ) {}


@Get()
async getAllHistories(@Request() req: ExpressRequest){
    return await this.gameService.getAllHistories(+req.query.userId)
}

}
