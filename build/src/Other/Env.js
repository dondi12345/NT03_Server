"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variable = exports.Mongo = exports.port = void 0;
exports.port = {
    portAPI: 4000,
    portMessageServer: 8000,
    portChatServer: 8010,
    portAccountServer: 8020,
};
exports.Mongo = {
    dbLink: "mongodb://127.0.0.1:27017",
    // dbLink : "mongodb+srv://dondi1412:Trunghung24@cluster0.vj24px5.mongodb.net/",
    DbName: "NT03",
};
exports.variable = {
    eventSocketConnection: "connection",
    eventSocketListening: "listening",
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
