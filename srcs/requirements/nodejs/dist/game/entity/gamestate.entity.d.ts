import { Socket } from "socket.io";
export declare enum PlayerState {
    NONE = 0,
    WAITING = 1,
    PLAYING = 2
}
export declare class UserSocket extends Socket {
    data: {
        state: PlayerState;
        user: number;
        game: number | undefined;
    };
}
export declare const GameConstants: {
    TOP: number;
    BOTTOM: number;
    LEFT: number;
    RIGHT: number;
    PADDLE_WIDTH: number;
    PADDLE_HEIGHT: number;
    BALL_RADIUS: number;
};
export declare class GameState {
    paddle1: number;
    paddle2: number;
    ballX: number;
    ballY: number;
    ballVelX: number;
    ballVelY: number;
    player1: number;
    player2: number;
    score1: number;
    score2: number;
    player1_pressUp: boolean;
    player1_pressDown: boolean;
    player2_pressUp: boolean;
    player2_pressDown: boolean;
    player1_socket: string;
    player2_socket: string;
    game_entity: number;
}
