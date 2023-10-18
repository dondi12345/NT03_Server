"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateStatus_AAC = exports.PlayerStatus_AAC = exports.Class_AAC = void 0;
var Class_AAC;
(function (Class_AAC) {
    Class_AAC[Class_AAC["Knight"] = 0] = "Knight";
    Class_AAC[Class_AAC["Warrior"] = 1] = "Warrior";
    Class_AAC[Class_AAC["Assassin"] = 2] = "Assassin";
    Class_AAC[Class_AAC["Archer"] = 3] = "Archer";
    Class_AAC[Class_AAC["Warlock"] = 4] = "Warlock";
    Class_AAC[Class_AAC["Bishop"] = 5] = "Bishop";
    Class_AAC[Class_AAC["Tanker"] = 6] = "Tanker";
    Class_AAC[Class_AAC["Titan"] = 7] = "Titan";
    Class_AAC[Class_AAC["ArchMage"] = 8] = "ArchMage";
    Class_AAC[Class_AAC["Marksman"] = 9] = "Marksman";
})(Class_AAC = exports.Class_AAC || (exports.Class_AAC = {}));
var PlayerStatus_AAC;
(function (PlayerStatus_AAC) {
    PlayerStatus_AAC[PlayerStatus_AAC["NotReady"] = 0] = "NotReady";
    PlayerStatus_AAC[PlayerStatus_AAC["Ready"] = 1] = "Ready";
})(PlayerStatus_AAC = exports.PlayerStatus_AAC || (exports.PlayerStatus_AAC = {}));
var StateStatus_AAC;
(function (StateStatus_AAC) {
    StateStatus_AAC[StateStatus_AAC["Lobby"] = 0] = "Lobby";
    StateStatus_AAC[StateStatus_AAC["Matching"] = 1] = "Matching";
})(StateStatus_AAC = exports.StateStatus_AAC || (exports.StateStatus_AAC = {}));
