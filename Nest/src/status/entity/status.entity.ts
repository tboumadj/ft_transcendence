import { Exclude } from "class-transformer";
import { Socket } from 'socket.io';

export class StatusEntity {

  @Exclude()
  id: number;
  socket: Socket;

  state: number;
}
