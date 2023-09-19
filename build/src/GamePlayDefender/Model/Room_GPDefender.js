"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room_GPDefender = exports.TimeDela = void 0;
const colyseus_1 = require("colyseus");
const State_GPDefender_1 = require("./State_GPDefender");
const LogController_1 = require("../../LogServer/Controller/LogController");
const DataModel_1 = require("../../Utils/DataModel");
const Router_GPDefender_1 = require("../Router/Router_GPDefender");
const Controller__GPDefender_1 = require("../Controller/Controller__GPDefender");
const MonsterBot_GPDefender_1 = require("../Controller/MonsterBot_GPDefender");
exports.TimeDela = 0.5;
class Room_GPDefender extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.slot1 = "";
        this.slot2 = "";
        this.maxClients = 2;
        this.curClients = 0;
    }
    onCreate(options) {
        console.log("StateHandlerRoom created!", options);
        var state = new State_GPDefender_1.State_GPDefender();
        this.setState(state);
        this.onMessage("message", (client, data) => {
            LogController_1.logController.LogDev("Dev Recive: ", data);
            var message = DataModel_1.DataModel.Parse(data);
            Router_GPDefender_1.router_GPDefender.Router(message, this);
        });
        this.monsterBot = new MonsterBot_GPDefender_1.MonsterBot_GPDefender();
        this.monsterBot.Init(this);
        this.Update();
        Controller__GPDefender_1.controller_GPDefender.RoomStart(this);
        this.state.barrier_id = "barrier";
        this.state.game_status = State_GPDefender_1.GameStatus.playing;
    }
    Update() {
        this.state.time += exports.TimeDela;
        this.monsterBot.Update();
        setTimeout(() => {
            this.Update();
        }, exports.TimeDela * 1000);
    }
    onJoin(client, options) {
        LogController_1.logController.LogDev("Dev", options.name_player, client.sessionId, "joined!");
        this.state.createPlayer(client.sessionId, options.name_player);
        Controller__GPDefender_1.controller_GPDefender.PutPlayer(client.sessionId, this);
        this.curClients++;
    }
    onLeave(client) {
        LogController_1.logController.LogDev("Dev", client.sessionId, "left!");
        this.state.removePlayer(client.sessionId);
        Controller__GPDefender_1.controller_GPDefender.RemoveSlot(client.sessionId, this);
        this.curClients--;
        if (this.curClients <= 0) {
            this.state.bullets.clear();
            this.state.monsters.clear();
            this.monsterBot.Destroy();
        }
    }
    onDispose() {
        LogController_1.logController.LogDev("Dev Dispose StateHandlerRoom");
    }
}
exports.Room_GPDefender = Room_GPDefender;
