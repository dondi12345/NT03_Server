"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerDataJoin_C4PE = exports.PlayerData_C4PE = exports.JobEnum = void 0;
var JobEnum;
(function (JobEnum) {
    JobEnum[JobEnum["Warrior"] = 0] = "Warrior";
    JobEnum[JobEnum["Mage"] = 1] = "Mage";
    JobEnum[JobEnum["Thief"] = 2] = "Thief";
})(JobEnum = exports.JobEnum || (exports.JobEnum = {}));
class PlayerData_C4PE {
    constructor() {
        this.sessionId = "";
        this.playerID = "";
        this.playerName = "";
        this.playerIcon = 0;
        this.Job = 0;
        this.Lv = 1;
        this.STR = 0;
        this.VIT = 0;
        this.DEX = 0;
        this.MND = 0;
        this.SPI = 0;
        this.SPD = 0;
        this.HIT = 0;
        this.EVA = 0;
        this.CRI = 0;
        this.CRD = 0;
        this.VIS = 0;
        this.HP = 0;
        this.MP = 0;
    }
}
exports.PlayerData_C4PE = PlayerData_C4PE;
class PlayerDataJoin_C4PE {
    constructor() {
        this.playerIcon = 0;
        this.Job = 0;
    }
}
exports.PlayerDataJoin_C4PE = PlayerDataJoin_C4PE;
