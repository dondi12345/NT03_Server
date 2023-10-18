"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room_C4PE = void 0;
const colyseus_1 = require("colyseus");
const State_C4PE_1 = require("./State_C4PE");
const DataModel_1 = require("../../Utils/DataModel");
const Controller_C4PE_1 = require("../Controller/Controller_C4PE");
const MsgCode_C4PE_1 = require("./MsgCode_C4PE");
const NTDictionary_1 = require("../../Utils/NTDictionary");
class Room_C4PE extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 2;
    }
    onCreate(options) {
        console.log("Room_C4PE created!", options);
        var state = new State_C4PE_1.State_C4PE();
        this.playerDataDic = new NTDictionary_1.NTDictionary();
        this.setState(state);
        this.onMessage("message", (client, data) => {
            console.log(client.sessionId, data);
            var message = DataModel_1.DataModel.Parse(data);
            if (message.MessageCode == MsgCode_C4PE_1.MsgCode_C4PE.Ready) {
                Controller_C4PE_1.controller_C4PE.PlayerReady(this, client);
                return;
            }
        });
    }
    onJoin(client, options) {
        console.log(client.sessionId + ": Join", options);
        var playerDataJoin = DataModel_1.DataModel.Parse(options.PlayerDataJoin);
        Controller_C4PE_1.controller_C4PE.PlayerJoin(this, client, playerDataJoin);
    }
    onLeave(client) {
        console.log(client.sessionId + ": Left");
        Controller_C4PE_1.controller_C4PE.PlayerLeave(this, client);
    }
}
exports.Room_C4PE = Room_C4PE;
