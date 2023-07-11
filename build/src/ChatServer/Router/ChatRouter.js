"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRouterWithoutSocket = exports.ChatRouter = void 0;
const ChatController_1 = require("../Controller/ChatController");
const MSGChatCode_1 = require("../Model/MSGChatCode");
function ChatRouter(msgChat, socket) {
    if (msgChat.MSGChatCode == MSGChatCode_1.MSGChatCode.TestMSGChat) {
        console.log("Dev 1684566303 TestChat");
        return;
    }
    if (msgChat.MSGChatCode == MSGChatCode_1.MSGChatCode.SendMSGChat) {
        (0, ChatController_1.SendChat)(msgChat);
        return;
    }
}
exports.ChatRouter = ChatRouter;
function ChatRouterWithoutSocket(msgChat) {
    if (msgChat.MSGChatCode == MSGChatCode_1.MSGChatCode.ReciveMSGChat) {
        (0, ChatController_1.ReciveChat)(msgChat);
        return;
    }
}
exports.ChatRouterWithoutSocket = ChatRouterWithoutSocket;
