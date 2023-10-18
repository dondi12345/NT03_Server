"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room_AAC = void 0;
const colyseus_1 = require("colyseus");
const NTDictionary_1 = require("../../Utils/NTDictionary");
const State_AAC_1 = require("./State_AAC");
const DataModel_1 = require("../../Utils/DataModel");
const MsgCode_AAC_1 = require("./MsgCode_AAC");
const Controller_AAC_1 = require("../Controller/Controller_AAC");
class Room_AAC extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 2;
    }
    onCreate(options) {
        console.log("Room_AAC created!", options);
        var state = new State_AAC_1.State_AAC();
        this.setState(state);
        this.onMessage("message", (client, data) => {
            console.log(client.sessionId, data);
            var message = DataModel_1.DataModel.Parse(data);
            if (message.MessageCode == MsgCode_AAC_1.MsgCode_AAC.Ready) {
                // controller_AAC.PlayerReady(this, client)
                return;
            }
        });
        this.InitRoom();
    }
    onJoin(client, options) {
        console.log(client.sessionId + ": Join", options);
        var playerData = DataModel_1.DataModel.Parse(options.PlayerDataJoin);
        Controller_AAC_1.controller_AAC.PlayerJoin(this, client, playerData);
    }
    onLeave(client) {
        console.log(client.sessionId + ": Left");
        Controller_AAC_1.controller_AAC.PlayerLeave(this, client);
    }
    InitRoom() {
        this.playerDataDic = new NTDictionary_1.NTDictionary();
    }
}
exports.Room_AAC = Room_AAC;
