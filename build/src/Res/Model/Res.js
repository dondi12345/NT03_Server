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
exports.UpdateRes = exports.FindItemByIdUserPlayerAndCode = exports.FindResByIdUserPlayer = exports.CreateRes = exports.ResModel = exports.Res = exports.ResData = exports.Reses = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ResCode_1 = require("./ResCode");
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const LogModel_1 = require("../../LogServer/Model/LogModel");
class Reses {
    constructor() {
        this.Elements = [];
    }
}
exports.Reses = Reses;
class ResData {
    static Parse(data) {
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return data;
        }
    }
}
exports.ResData = ResData;
class Res {
    constructor(resCode, idUserPlayer, number) {
        this.Code = resCode;
        this.IdUserPlayer = idUserPlayer;
        this.Number = number;
    }
    static Parse(data) {
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return data;
        }
    }
}
exports.Res = Res;
const ResSchema = new mongoose_1.Schema({
    Code: { type: Number, enum: ResCode_1.ResCode },
    IdUserPlayer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'UserPlayer' },
    Number: { type: Number, default: 0 },
});
exports.ResModel = mongoose_1.default.model('Res', ResSchema);
function CreateRes(res) {
    return __awaiter(this, void 0, void 0, function* () {
        var data;
        yield exports.ResModel.create(res).then((respone) => {
            console.log("Dev 1686240002 " + respone);
            data = Res.Parse(respone);
        }).catch((e) => {
            console.log("Dev 1686240018 " + e);
            data = null;
        });
        console.log("Dev 1686239656 " + data);
        return data;
    });
}
exports.CreateRes = CreateRes;
function FindResByIdUserPlayer(idUserPlayer) {
    return __awaiter(this, void 0, void 0, function* () {
        var itemes;
        yield exports.ResModel.find({ IdUserPlayer: idUserPlayer }).then((res) => {
            itemes = res;
        });
        return itemes;
    });
}
exports.FindResByIdUserPlayer = FindResByIdUserPlayer;
function FindItemByIdUserPlayerAndCode(idUserPlayer, code) {
    return __awaiter(this, void 0, void 0, function* () {
        var item;
        yield exports.ResModel.findOne({ IdUserPlayer: idUserPlayer, Code: code }).then((res) => {
            item = res;
        });
        return item;
    });
}
exports.FindItemByIdUserPlayerAndCode = FindItemByIdUserPlayerAndCode;
function UpdateRes(res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Dev 1685723760 " + res);
        exports.ResModel.updateOne({
            _id: res._id
        }, {
            Number: res.Number,
        }).then((res) => {
            console.log("Dev 1685723759 " + res);
        }).catch(e => {
            (0, LogController_1.LogIdUserPlayer)(LogCode_1.LogCode.Res_SaveFail, res.IdUserPlayer.toHexString(), e, LogModel_1.LogType.Error);
        });
    });
}
exports.UpdateRes = UpdateRes;
