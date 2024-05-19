import { Socket } from 'socket.io';
export declare class StatusEntity {
    id: number;
    socket: Socket;
    state: number;
}
