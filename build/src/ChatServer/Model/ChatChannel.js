"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindGlobalChannel = exports.CreateChatChannel = exports.GetChatChannelById = exports.ChatChannelModel = exports.ChatChannel = exports.TyppeChatChannelCode = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const ServerGameCode_1 = require("../../UserPlayerServer/Model/ServerGameCode");
var TyppeChatChannelCode;
(function (TyppeChatChannelCode) {
    TyppeChatChannelCode[TyppeChatChannelCode["Global"] = 10000] = "Global";
    TyppeChatChannelCode[TyppeChatChannelCode["Guild"] = 10001] = "Guild";
})(TyppeChatChannelCode = exports.TyppeChatChannelCode || (exports.TyppeChatChannelCode = {}));
class ChatChannel {
    static Parse(data) {
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return data;
        }
    }
}
exports.ChatChannel = ChatChannel;
const ChatChannelSchema = new mongoose_2.Schema({
    TyppeChatChannelCode: { type: Number, enum: TyppeChatChannelCode },
    ServerGameCode: { type: Number, enum: ServerGameCode_1.ServerGameCode },
    Detail: String,
});
exports.ChatChannelModel = mongoose_1.default.model('ChatChannel', ChatChannelSchema);
function GetChatChannelById(_id) {
    return __awaiter(this, void 0, void 0, function* () {
        var chatChannel;
        yield exports.ChatChannelModel.findById(_id).then((res) => {
            chatChannel = ChatChannel.Parse(res);
        }).catch((err) => {
            chatChannel = null;
        });
        return chatChannel;
    });
}
exports.GetChatChannelById = GetChatChannelById;
function CreateChatChannel(chatChannel) {
    return __awaiter(this, void 0, void 0, function* () {
        var data;
        yield exports.ChatChannelModel.create(chatChannel).then((res => {
            data = res;
        }));
        return data;
    });
}
exports.CreateChatChannel = CreateChatChannel;
function FindGlobalChannel(serverGameCode) {
    return __awaiter(this, void 0, void 0, function* () {
        var globalChannel;
        yield exports.ChatChannelModel.findOne({ TyppeChatChannelCode: TyppeChatChannelCode.Global, ServerGameCode: serverGameCode }).then((res) => __awaiter(this, void 0, void 0, function* () {
            if (res == null || res == undefined) {
                var newGlobalChannel = new ChatChannel();
                newGlobalChannel.Detail = "Global channel of SV" + serverGameCode;
                newGlobalChannel.ServerGameCode = serverGameCode;
                newGlobalChannel.TyppeChatChannelCode = TyppeChatChannelCode.Global;
                yield CreateChatChannel(newGlobalChannel).then(res1 => {
                    globalChannel = res1;
                });
            }
            else {
                globalChannel = res;
            }
        }));
        return globalChannel;
    });
}
exports.FindGlobalChannel = FindGlobalChannel;
