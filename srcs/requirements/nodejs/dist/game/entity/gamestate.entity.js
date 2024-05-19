"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = exports.GameConstants = exports.UserSocket = exports.PlayerState = void 0;
const socket_io_1 = require("socket.io");
var PlayerState;
(function (PlayerState) {
    PlayerState[PlayerState["NONE"] = 0] = "NONE";
    PlayerState[PlayerState["WAITING"] = 1] = "WAITING";
    PlayerState[PlayerState["PLAYING"] = 2] = "PLAYING";
})(PlayerState || (exports.PlayerState = PlayerState = {}));
class UserSocket extends socket_io_1.Socket {
}
exports.UserSocket = UserSocket;
exports.GameConstants = {
    TOP: 50,
    BOTTOM: -50,
    LEFT: 100,
    RIGHT: -100,
    PADDLE_WIDTH: 3,
    PADDLE_HEIGHT: 20,
    BALL_RADIUS: 8
};
class GameState {
}
exports.GameState = GameState;
//# sourceMappingURL=gamestate.entity.js.map