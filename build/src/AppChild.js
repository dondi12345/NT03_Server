"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppChild = void 0;
// Import necessary modules
const Init_1 = __importDefault(require("./Service/Init"));
const MessageService_1 = require("./MessageServer/Service/MessageService");
const ChatService_1 = require("./ChatServer/Service/ChatService");
const ResService_1 = require("./Res/Service/ResService");
const HeroEquipService_1 = require("./HeroEquip/Service/HeroEquipService");
const HeroService_1 = require("./HeroServer/Service/HeroService");
const ShopService_1 = require("./Shop/Service/ShopService");
const DataCenterService_1 = require("./DataCenter/Service/DataCenterService");
// Function to create app child instance
function AppChild() {
    console.log("Dev 1684561087 Init AppChild");
    Init_1.default.InitDatabase().then(() => {
        (0, MessageService_1.InitMessageServerWithSocket)();
        (0, DataCenterService_1.InitDataVersion)();
        (0, ChatService_1.InitChatServer)();
        (0, HeroService_1.InitHero)();
        (0, ResService_1.InitRes)();
        (0, HeroEquipService_1.InitHeroEquip)();
        (0, ShopService_1.InitShop)();
    }).catch(err => {
        console.log(err);
    });
}
exports.AppChild = AppChild;
