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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroModel = exports.Hero = exports.HeroGear = exports.HeroData = exports.HeroUpgradeLv = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const HeroCode_1 = require("./HeroCode");
const GenderCode_1 = require("./GenderCode");
const HeroFashion_1 = require("../../HeroFashion/HeroFashion");
class HeroUpgradeLv {
    static Parse(data) {
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return data;
        }
    }
}
exports.HeroUpgradeLv = HeroUpgradeLv;
class HeroData {
    static Parse(data) {
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return data;
        }
    }
}
exports.HeroData = HeroData;
class HeroGear {
    constructor() {
        this.IdWeapon = "";
        this.IdArmor = "";
        this.IdHelmet = "";
    }
}
exports.HeroGear = HeroGear;
class Hero extends mongoose_1.Document {
    constructor() {
        super();
        this._id = new mongoose_1.Types.ObjectId();
        this.Lv = 1;
        this.Code = HeroCode_1.HeroCode.Unknown;
        this.HeroName = HeroFashion_1.HeroFashionVar.FirstNames[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.FirstNames.length)]
            + " " + HeroFashion_1.HeroFashionVar.LastNames[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.LastNames.length)];
        this.GenderCode = Math.random() < 0.5 ? GenderCode_1.GenderCode.Male : GenderCode_1.GenderCode.Female;
        if (this.GenderCode == GenderCode_1.GenderCode.Male) {
            this.Eyes = HeroFashion_1.HeroFashion.NewHeroFashion(HeroFashion_1.HeroFashionVar.MaleEyes[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.MaleEyes.length)]);
            this.Hair = HeroFashion_1.HeroFashion.NewHeroFashion(HeroFashion_1.HeroFashionVar.MaleHair[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.MaleHair.length)], HeroFashion_1.HeroFashionVar.Color[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.Color.length)]);
        }
        else {
            this.Eyes = HeroFashion_1.HeroFashion.NewHeroFashion(HeroFashion_1.HeroFashionVar.FemaleEyes[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.FemaleEyes.length)]);
            this.Hair = HeroFashion_1.HeroFashion.NewHeroFashion(HeroFashion_1.HeroFashionVar.FemaleHair[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.FemaleHair.length)], HeroFashion_1.HeroFashionVar.Color[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.Color.length)]);
        }
        this.Eyebrow = HeroFashion_1.HeroFashion.NewHeroFashion(HeroFashion_1.HeroFashionVar.Eyebrow[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.Eyebrow.length)]);
        this.Mouths = HeroFashion_1.HeroFashion.NewHeroFashion(HeroFashion_1.HeroFashionVar.Mouths[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.Mouths.length)]);
    }
    InitData(idUserPlayer, heroCode) {
        this.IdUserPlayer = idUserPlayer;
        this.Code = heroCode;
    }
}
exports.Hero = Hero;
const HeroSchema = new mongoose_1.Schema({
    IdUserPlayer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'UserPlayer' },
    Lv: { type: Number, default: 1 },
    Code: { type: Number, enum: HeroCode_1.HeroCode },
    GenderCode: { type: Number, enum: GenderCode_1.GenderCode },
    HeroName: { type: String },
    Eyes: { Index: { type: String }, Color: { type: String }, },
    Eyebrow: { Index: { type: String }, Color: { type: String }, },
    Hair: { Index: { type: String }, Color: { type: String }, },
    Mouths: { Index: { type: String }, Color: { type: String }, },
    HeroGear: {
        IdWeapon: { type: String, default: "" },
        IdArmor: { type: String, default: "" },
        IdHelmet: { type: String, default: "" },
    }
});
exports.HeroModel = mongoose_1.default.model('Hero', HeroSchema);
