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
exports.InitPlayerChatChannel = exports.InitGlobalChatChannel = exports.AppTest = void 0;
const mongoose_1 = require("mongoose");
const ChatChannel_1 = require("./ChatServer/Model/ChatChannel");
const UserChatChannel_1 = require("./ChatServer/Model/UserChatChannel");
const Init_1 = __importDefault(require("./Service/Init"));
const HeroTeam_1 = require("./HeroTeam/Model/HeroTeam");
function AppTest() {
    Init_1.default.InitDatabase().then(() => {
        (0, HeroTeam_1.TestHeroTeam)();
        // HeroModel.deleteMany({HeroName : "Clone"}).then(res=>{
        //     // console.log(res);
        // })
    });
}
exports.AppTest = AppTest;
function InitGlobalChatChannel() {
    return __awaiter(this, void 0, void 0, function* () {
        var globalChannel = new ChatChannel_1.ChatChannel();
        globalChannel.TyppeChatChannelCode = ChatChannel_1.TyppeChatChannelCode.Global;
        globalChannel.Detail = "This global channel";
        yield ChatChannel_1.ChatChannelModel.find({ "TyppeChatChannelCode": ChatChannel_1.TyppeChatChannelCode.Global }).then(res => {
            console.log("Dev 1684596348 " + res.length);
            if (res.length > 0)
                return;
            (0, ChatChannel_1.CreateChatChannel)(globalChannel).then((res) => {
                console.log("Dev 1684583339 " + res._id);
            });
        });
    });
}
exports.InitGlobalChatChannel = InitGlobalChatChannel;
function InitPlayerChatChannel() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, UserChatChannel_1.UserJoinToChatChannel)(new mongoose_1.Types.ObjectId("6468e1dc24d4fe15f2f4dbf7"), new mongoose_1.Types.ObjectId("6468b53dc6255c8fb16f8a9e"));
    });
}
exports.InitPlayerChatChannel = InitPlayerChatChannel;
