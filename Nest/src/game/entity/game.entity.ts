import { User } from "@prisma/client";
import { Exclude } from "class-transformer";

export class Game {

  @Exclude()
  id: number;

  p1: User;
  p2: User;

  scorP1: number;
  scorP2: number;
  playedOn: Date;
}
