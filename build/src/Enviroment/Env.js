"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Redis = exports.variable = exports.Mongo = exports.port = void 0;
exports.port = {
    portAPI: 4000,
    portMessageServer: 8000,
    portChatServer: 8010,
    portAccountServer: 8020,
    portDailyLoginReward: 8030,
    portAPIServer: 3001,
};
exports.Mongo = {
    // dbLink : "mongodb://45.124.95.182:27017",
    // dbLink : "mongodb+srv://dondi1412:Trunghung24@cluster0.vj24px5.mongodb.net/",
    // dbLink : "mongodb://localhost:27017",
    dbLink: "mongodb://nt03:Trunghung24@103.116.9.104:27017/?authMechanism=DEFAULT",
    DbName: "NT03",
};
exports.variable = {
    eventSocketConnection: "connection",
    eventSocketListening: "listening",
    eventSocketDisconnect: "disconnect",
    worker: "worker",
    messageServer: "MessageServer",
    chatServer: "ChatServer",
    chatSystem: "ChatSystem",
    idChatGlobal: "643e14f2d8930cecd1865a60",
    maxLengthChat: 50,
    maxLandRacingHourse: 8,
    maxStepRacingHourse: 20,
    localhost: "localhost",
    // localhost : "45.124.95.182",
};
exports.Redis = {
    EventMessage: "message",
    AccountChannel: "AccountChannel",
    UserPlayerChannel: "UserPlayerChannel",
    KeyUserPlayerSession: "UserPlayer:Session:",
    KeyHeroSummon: "Hero:Summon:",
};
