"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserPlayer = exports.FindByIdAccountAndServerGameCode = exports.CreateUserPlayer = exports.GetUserPlayerById = exports.UserPlayerModel = exports.UserPlayer = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ServerGameCode_1 = require("./ServerGameCode");
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const LogModel_1 = require("../../LogServer/Model/LogModel");
class UserPlayer {
    constructor() {
        this._id = new mongoose_1.Types.ObjectId();
        this.Name = "Player" + (10000 + Math.floor(Math.random() * 90000));
        this.Wave = 0;
    }
    static NewUserPlayer(idAccount, serverGameCode) {
        var userPlayer = new UserPlayer();
        userPlayer.IdAccount = idAccount;
        userPlayer.ServerGameCode = serverGameCode;
        return userPlayer;
    }
    static Parse(data) {
        try {
            data = JSON.parse(data);
        }
        catch (err) { }
        return data;
    }
}
exports.UserPlayer = UserPlayer;
const UserPlayerSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, default: new mongoose_1.Types.ObjectId() },
    IdAccount: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Account' },
    ServerGameCode: { type: Number, enum: ServerGameCode_1.ServerGameCode },
    Wave: { type: Number, default: 0 }
});
exports.UserPlayerModel = mongoose_1.default.model('UserPlayer', UserPlayerSchema);
function GetUserPlayerById(_id) {
    return __awaiter(this, void 0, void 0, function* () {
        var userPlayer = new UserPlayer();
        yield exports.UserPlayerModel.findById(_id).then((res) => {
            userPlayer = UserPlayer.Parse(res);
        }).catch((err) => {
            console.log(err);
        });
        return userPlayer;
    });
}
exports.GetUserPlayerById = GetUserPlayerById;
function CreateUserPlayer(userPlayer) {
    return __awaiter(this, void 0, void 0, function* () {
        var newUserPlayer;
        yield exports.UserPlayerModel.create(userPlayer).then(res => {
            newUserPlayer = res;
        });
        return newUserPlayer;
    });
}
exports.CreateUserPlayer = CreateUserPlayer;
function FindByIdAccountAndServerGameCode(idAccount, serverGameCode) {
    return __awaiter(this, void 0, void 0, function* () {
        var userPlayer;
        yield exports.UserPlayerModel.findOne({ IdAccount: idAccount, ServerGameCode: serverGameCode }).then((res) => {
            userPlayer = UserPlayer.Parse(res);
        });
        return userPlayer;
    });
}
exports.FindByIdAccountAndServerGameCode = FindByIdAccountAndServerGameCode;
function UpdateUserPlayer(userPlayer) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Dev 1688027507 ", userPlayer);
        exports.UserPlayerModel.updateOne({ _id: userPlayer._id }, {
            ServerGameCode: userPlayer.ServerGameCode,
            Name: userPlayer.Name,
            Wave: userPlayer.Wave ? userPlayer.Wave : 0,
        }).then(res => {
            (0, LogController_1.LogIdUserPlayer)(LogCode_1.LogCode.UserPlayerServer_SaveUserPlayer, userPlayer._id.toString(), "", LogModel_1.LogType.Normal);
            console.log("Dev 1687943868 ", res);
        }).catch(e => {
            (0, LogController_1.LogIdUserPlayer)(LogCode_1.LogCode.UserPlayerServer_SaveFailUserPlayer, userPlayer._id.toString(), e, LogModel_1.LogType.Error);
        });
    });
}
exports.UpdateUserPlayer = UpdateUserPlayer;
