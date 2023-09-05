"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisKeyConfig = exports.RedisConfig = exports.SocketConfig = exports.variable = exports.Mongo = exports.portConfig = void 0;
exports.portConfig = {
    portAPI: 3000,
    portAPIServer: 3001,
    portMessageServer: 3002,
    portChatServer: 3003,
    portAccountServer: 3004,
    portDailyLoginReward: 3005,
    portWebServer: 3006,
    portMiniGameWord: 3007,
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
exports.SocketConfig = {
    Listening: "listening",
};
exports.RedisConfig = {
    Host: "103.116.9.104",
    Port: "6379",
    Password: "Trunghung24",
    MessagePubSub: "MessagePubSub",
    AccountChannel: "AccountChannel",
    UserPlayerChannel: "UserPlayerChannel",
    KeyUserPlayerSession: "NT03:UserPlayer:Session:",
};
class RedisKey {
    constructor() {
        this.NameProject = "NT03";
    }
    KeyDataCenterDetail(dataName) {
        return this.NameProject + ":DataCenter:" + dataName + ":Detail";
    }
    KeyDataCenterElement(dataName, index) {
        return this.NameProject + ":DataCenter:" + dataName + ":Element:" + index;
    }
    KeyHeroSummon(userID) {
        return this.NameProject + ":UserPlayer:" + userID + ":HeroSummon";
    }
    KeyUserPlayerSession(userID) {
        return this.NameProject + ":UserPlayer:" + userID + ":Session";
    }
    KeyUserPlayerData(userID) {
        return this.NameProject + ":UserPlayer:" + userID + ":Data";
    }
    KeyCurrencyData(userID) {
        return this.NameProject + ":UserPlayer:" + userID + ":Currency";
    }
    KeyHeroTeamData(userID) {
        return this.NameProject + ":UserPlayer:" + userID + ":HeroTeam";
    }
    KeyHeroData(userID, heroID) {
        return this.NameProject + ":UserPlayer:" + userID + ":Hero:" + heroID;
    }
    KeyHeroEquipData(userID, heroEquipID) {
        return this.NameProject + ":UserPlayer:" + userID + ":HeroEquip:" + heroEquipID;
    }
}
exports.RedisKeyConfig = new RedisKey();
