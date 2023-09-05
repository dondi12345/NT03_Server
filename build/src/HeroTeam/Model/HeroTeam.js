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
exports.TestHeroTeam = exports.RemoveSlotHeroTeam = exports.UpdateHeroTeam = exports.FindHeroTeamByIdUserPlayer = exports.CreateHeroTeam = exports.HeroTeamModel = exports.HeroTeam = exports.SelectHero = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const LogModel_1 = require("../../LogServer/Model/LogModel");
class SelectHero {
    static Parse(data) {
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return data;
        }
    }
}
exports.SelectHero = SelectHero;
class HeroTeam extends mongoose_1.Document {
    constructor() {
        super(...arguments);
        this.Slot1 = "";
        this.Slot2 = "";
        this.Slot3 = "";
        this.Slot4 = "";
        this.Slot5 = "";
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
exports.HeroTeam = HeroTeam;
const HeroTeamSchema = new mongoose_1.Schema({
    IdUserPlayer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'UserPlayer' },
    Power: { type: Number, default: 0 },
    Slot1: { type: String, default: "" },
    Slot2: { type: String, default: "" },
    Slot3: { type: String, default: "" },
    Slot4: { type: String, default: "" },
    Slot5: { type: String, default: "" },
});
exports.HeroTeamModel = mongoose_1.default.model('HeroTeam', HeroTeamSchema);
function CreateHeroTeam(heroTeam) {
    return __awaiter(this, void 0, void 0, function* () {
        var data;
        yield exports.HeroTeamModel.create(heroTeam).then((res) => {
            console.log("Dev 1685285708 " + res);
            data = HeroTeam.Parse(res);
        }).catch((e) => {
            console.log("Dev 1685285716 " + e);
            data = null;
        });
        return data;
    });
}
exports.CreateHeroTeam = CreateHeroTeam;
function FindHeroTeamByIdUserPlayer(idUserPlayer) {
    return __awaiter(this, void 0, void 0, function* () {
        var data;
        yield exports.HeroTeamModel.findOne({ IdUserPlayer: idUserPlayer }).then((res) => {
            data = HeroTeam.Parse(res);
        });
        return data;
    });
}
exports.FindHeroTeamByIdUserPlayer = FindHeroTeamByIdUserPlayer;
function UpdateHeroTeam(heroTeam) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.HeroTeamModel.updateOne({ IdUserPlayer: heroTeam.IdUserPlayer }, {
            Power: heroTeam.Power,
            Slot1: heroTeam.Slot1,
            Slot2: heroTeam.Slot2,
            Slot3: heroTeam.Slot3,
            Slot4: heroTeam.Slot4,
            Slot5: heroTeam.Slot5,
        }).then(res => {
            console.log("Dev 1687617539 ", res);
        }).catch((e) => {
            (0, LogController_1.LogIdUserPlayer)(LogCode_1.LogCode.HeroTeam_SaveFail, heroTeam.IdUserPlayer.toString(), e, LogModel_1.LogType.Error);
        });
    });
}
exports.UpdateHeroTeam = UpdateHeroTeam;
function RemoveSlotHeroTeam(heroTeam) {
    return __awaiter(this, void 0, void 0, function* () {
        var query = {};
        if (heroTeam.Slot1 == null || heroTeam.Slot1 == undefined) {
            query["Slot1"] = "";
        }
        if (heroTeam.Slot2 == null || heroTeam.Slot2 == undefined) {
            query["Slot2"] = "";
        }
        if (heroTeam.Slot3 == null || heroTeam.Slot3 == undefined) {
            query["Slot3"] = "";
        }
        if (heroTeam.Slot4 == null || heroTeam.Slot4 == undefined) {
            query["Slot4"] = "";
        }
        if (heroTeam.Slot5 == null || heroTeam.Slot5 == undefined) {
            query["Slot5"] = "";
        }
        console.log("Dev 1687859261 ", heroTeam);
        exports.HeroTeamModel.updateOne({ IdUserPlayer: heroTeam.IdUserPlayer }, { $unset: query }).then(res => {
            console.log("Dev 1687617538 ", res);
        }).catch((e) => {
            (0, LogController_1.LogIdUserPlayer)(LogCode_1.LogCode.HeroTeam_RemoveSlotFail, heroTeam.IdUserPlayer.toString(), e, LogModel_1.LogType.Error);
        });
    });
}
exports.RemoveSlotHeroTeam = RemoveSlotHeroTeam;
function TestHeroTeam() {
    return __awaiter(this, void 0, void 0, function* () {
        exports.HeroTeamModel.findById(new mongoose_1.Types.ObjectId("64967143a76f2a6e578af8e4")).then((res) => {
            var data = HeroTeam.Parse(res);
            data.Slot1 = "";
            UpdateHeroTeam(data);
        });
    });
}
exports.TestHeroTeam = TestHeroTeam;
