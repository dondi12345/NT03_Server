"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPlayerRouter = void 0;
const UserPlayerController_1 = require("../Controller/UserPlayerController");
const MSGUserPlayerCode_1 = require("../Model/MSGUserPlayerCode");
function UserPlayerRouter(msgUserPlayer) {
    if (msgUserPlayer.MSGUserPlayerCode == MSGUserPlayerCode_1.MSGUserPlayerCode.Test) {
        console.log("msgUserPlayer Test UserPlayer");
        return;
    }
    if (msgUserPlayer.MSGUserPlayerCode == MSGUserPlayerCode_1.MSGUserPlayerCode.JoinServer) {
        (0, UserPlayerController_1.JoinServer)(msgUserPlayer);
        return;
    }
}
exports.UserPlayerRouter = UserPlayerRouter;
