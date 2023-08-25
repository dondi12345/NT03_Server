"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateGuessNumberRoom = exports.StateGuessNumber = exports.PlayerGuessNumber = void 0;
const colyseus_1 = require("colyseus");
const schema_1 = require("@colyseus/schema");
const legthPass = 4;
const maxAnswers = 5;
const Ans = {
    correct: "2",
    correctNumber: "1",
    wrong: "0"
};
const StatusPlayer = {
    Lose: -1,
    Do: 0,
    Win: 1,
};
class PlayerGuessNumber extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.answer = "";
        this.correct = "";
        this.numb = 0;
        this.status = 0;
    }
}
__decorate([
    (0, schema_1.type)("string")
], PlayerGuessNumber.prototype, "answer", void 0);
__decorate([
    (0, schema_1.type)("string")
], PlayerGuessNumber.prototype, "correct", void 0);
__decorate([
    (0, schema_1.type)("number")
], PlayerGuessNumber.prototype, "numb", void 0);
__decorate([
    (0, schema_1.type)("number")
], PlayerGuessNumber.prototype, "status", void 0);
exports.PlayerGuessNumber = PlayerGuessNumber;
class StateGuessNumber extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.players = new schema_1.MapSchema();
        this.something = "This attribute won't be sent to the client-side";
    }
    createPlayer(sessionId) {
        this.players.set(sessionId, new PlayerGuessNumber());
    }
    removePlayer(sessionId) {
        this.players.delete(sessionId);
    }
    playerAnswer(sessionId, answer = "", pass) {
        var player = this.players.get(sessionId);
        if (player == null || player == undefined) {
            console.log("Not found: " + sessionId);
        }
        else {
            if (player.numb > legthPass) {
                console.log("Not turn");
                return;
            }
            ;
            if (answer.length < 4) {
                console.log("Inval");
                return;
            }
            var checkAns = "";
            for (let index = 0; index < pass.length; index++) {
                var check = Ans.wrong;
                for (let i = 0; i < pass.length; i++) {
                    if (answer[index] == pass[i]) {
                        if (index == i) {
                            console.log("correctNumber");
                            check = Ans.correct;
                            break;
                        }
                        else {
                            console.log("correctPosition");
                            check = Ans.correctNumber;
                            break;
                        }
                    }
                    else {
                        console.log("wrong");
                        check = Ans.wrong;
                    }
                }
                player.correct += check;
                checkAns += check;
                player.answer += answer[index];
            }
            player.numb++;
            if (checkAns == "2222") {
                player.status = StatusPlayer.Win;
                console.log("Win");
            }
            else if (player.numb >= legthPass) {
                player.status = StatusPlayer.Lose;
            }
            ;
        }
    }
}
__decorate([
    (0, schema_1.type)({ map: PlayerGuessNumber })
], StateGuessNumber.prototype, "players", void 0);
exports.StateGuessNumber = StateGuessNumber;
class ClientData {
}
class StateGuessNumberRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 2;
    }
    onCreate(options) {
        console.log("StateHandlerRoom created!", options);
        this.inti();
        var state = new StateGuessNumber();
        this.setState(state);
        this.onMessage("answer", (client, data) => {
            console.log("StateHandlerRoom received message from", client.sessionId, ":", data);
            this.state.playerAnswer(client.sessionId, data, this.pass);
        });
    }
    inti() {
        var chars = "0123456789";
        this.pass = "";
        for (let index = 0; index < 4; index++) {
            var pos = (Math.floor(Math.random() * chars.length));
            this.pass += chars[pos];
            console.log(chars[pos]);
            chars = chars.replace(chars[pos], "");
            console.log(chars);
        }
        console.log("Pass: ", this.pass);
    }
    onJoin(client, options) {
        // client.send("hello", "world");
        // var clientData = new ClientData();
        // clientData.client = client;
        // clientData.data = client.sessionId;
        // this.clientDatas.push(clientData);
        console.log(client.sessionId, "joined!");
        this.state.createPlayer(client.sessionId);
    }
    onLeave(client) {
        console.log(client.sessionId, "left!");
        this.state.removePlayer(client.sessionId);
    }
    onDispose() {
        console.log("Dispose StateHandlerRoom");
    }
}
exports.StateGuessNumberRoom = StateGuessNumberRoom;
