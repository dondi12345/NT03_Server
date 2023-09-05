"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageCode = exports.Message = void 0;
class Message {
    constructor() {
    }
}
exports.Message = Message;
exports.MessageCode = {
    player_answer: "guess_number/player_answer",
    result_answer: "guess_number/result_answer",
    player_lose: "guess_number/player_lose",
    player_win: "guess_number/player_win",
    game_start: "guess_number/game_start",
    game_end: "guess_number/game_end",
    time_over: "guess_number/time_over",
};
