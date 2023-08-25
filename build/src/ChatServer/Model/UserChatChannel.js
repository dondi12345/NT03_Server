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
exports.UserJoinToGlobalChannel = exports.UserJoinToChatChannel = exports.GetIdUserPlayerByIdChatChannel = exports.UserChatChannelModel = exports.UserChatChannel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ChatChannel_1 = require("./ChatChannel");
const mongoose_2 = require("mongoose");
class UserChatChannel {
    static Parse(data) {
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return data;
        }
    }
}
exports.UserChatChannel = UserChatChannel;
const UserChatChannelSchema = new mongoose_2.Schema({
    IdUserPlayer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'UserPlayer' },
    IdChatChannel: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'ChatChannel' }
});
exports.UserChatChannelModel = mongoose_1.default.model('UserChatChannel', UserChatChannelSchema);
function GetIdUserPlayerByIdChatChannel(IdChatChannel) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = [];
        yield exports.UserChatChannelModel.find({ IdChatChannel: IdChatChannel.toString() }).then(res => {
            console.log("Dev 1684576640 " + res.length);
            if (res.length > 0) {
                data = res;
            }
        });
        return data;
    });
}
exports.GetIdUserPlayerByIdChatChannel = GetIdUserPlayerByIdChatChannel;
function UserJoinToChatChannel(idUserPlayer, idChatChannel) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.UserChatChannelModel.find({ IdChatChannel: idChatChannel, IdUserPlayer: idUserPlayer }).then(res => {
            console.log("Dev 1684596592 " + res.length);
            if (res.length > 0)
                return;
            var userChatChannel = new UserChatChannel();
            userChatChannel.IdChatChannel = idChatChannel;
            userChatChannel.IdUserPlayer = idUserPlayer;
            exports.UserChatChannelModel.create(userChatChannel);
        });
    });
}
exports.UserJoinToChatChannel = UserJoinToChatChannel;
function UserJoinToGlobalChannel(idUserPlayer, serverGameCode) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, ChatChannel_1.FindGlobalChannel)(serverGameCode).then((res) => {
            try {
                UserJoinToChatChannel(idUserPlayer, res._id);
            }
            catch (error) {
                console.log("Dev 1684663387 " + error);
            }
        });
    });
}
exports.UserJoinToGlobalChannel = UserJoinToGlobalChannel;
