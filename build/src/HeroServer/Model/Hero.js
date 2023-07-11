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
exports.UpdateHero = exports.FindHeroById = exports.FindHeroByIdUserPlayer = exports.CreateHero = exports.HeroModel = exports.Hero = exports.HeroData = exports.Heroes = exports.HeroUpgradeLv = exports.Gear = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const HeroCode_1 = require("./HeroCode");
const GenderCode_1 = require("./GenderCode");
const HeroFashion_1 = require("../../HeroFashion/HeroFashion");
class Gear {
}
exports.Gear = Gear;
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
class Heroes {
    constructor() {
        this.Elements = [];
    }
}
exports.Heroes = Heroes;
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
class Hero {
    constructor() {
        this._id = new mongoose_1.Types.ObjectId();
        this._id = new mongoose_1.Types.ObjectId();
        this.Lv = 1;
        this.Code = HeroCode_1.HeroCode.Unknown;
        this.HeroName = HeroFashion_1.HeroFashionVar.FirstNames[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.FirstNames.length)]
            + " " + HeroFashion_1.HeroFashionVar.LastNames[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.LastNames.length)];
        this.GenderCode = Math.random() < 0.5 ? GenderCode_1.GenderCode.Male : GenderCode_1.GenderCode.Female;
        if (this.GenderCode == GenderCode_1.GenderCode.Male) {
            this.Eyes = HeroFashion_1.HeroFashion.NewHero(HeroFashion_1.HeroFashionVar.MaleEyes[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.MaleEyes.length)]);
            this.Hair = HeroFashion_1.HeroFashion.NewHero1(HeroFashion_1.HeroFashionVar.MaleHair[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.MaleHair.length)], HeroFashion_1.HeroFashionVar.Color[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.Color.length)]);
        }
        else {
            this.Eyes = HeroFashion_1.HeroFashion.NewHero(HeroFashion_1.HeroFashionVar.FemaleEyes[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.FemaleEyes.length)]);
            this.Hair = HeroFashion_1.HeroFashion.NewHero1(HeroFashion_1.HeroFashionVar.FemaleHair[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.FemaleHair.length)], HeroFashion_1.HeroFashionVar.Color[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.Color.length)]);
        }
        this.Eyebrow = HeroFashion_1.HeroFashion.NewHero(HeroFashion_1.HeroFashionVar.Eyebrow[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.Eyebrow.length)]);
        this.Mouths = HeroFashion_1.HeroFashion.NewHero(HeroFashion_1.HeroFashionVar.Mouths[Math.floor(Math.random() * HeroFashion_1.HeroFashionVar.Mouths.length)]);
    }
    static NewHero(data) {
        var hero = new Hero();
        if (data._id)
            hero._id = data._id;
        if (data.IdUserPlayer)
            hero.IdUserPlayer = data.IdUserPlayer;
        if (data.Lv)
            hero.Lv = data.Lv;
        if (data.HeroCode)
            hero.Code = data.HeroCode;
        if (data.HeroName)
            hero.HeroName = data.HeroName;
        if (data.GenderCode)
            hero.GenderCode = data.GenderCode;
        if (data.Eyes)
            hero.Eyes = data.Eyes;
        if (data.Eyebrow)
            hero.Eyebrow = data.Eyebrow;
        if (data.Hair)
            hero.Hair = data.Hair;
        if (data.Mouths)
            hero.Mouths = data.Mouths;
        return hero;
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
    Gear: {
        IdWeapon: { type: String },
        IdArmor: { type: String },
        IdHelmet: { type: String },
    }
});
exports.HeroModel = mongoose_1.default.model('Hero', HeroSchema);
function CreateHero(hero) {
    return __awaiter(this, void 0, void 0, function* () {
        var data;
        yield exports.HeroModel.create(hero).then((res) => {
            console.log("Dev 1685285706 " + res);
            data = Hero.Parse(res);
        }).catch((e) => {
            console.log("Dev 1685285714 " + e);
            data = null;
        });
        return data;
    });
}
exports.CreateHero = CreateHero;
function FindHeroByIdUserPlayer(idUserPlayer) {
    return __awaiter(this, void 0, void 0, function* () {
        var heroes;
        yield exports.HeroModel.find({ IdUserPlayer: idUserPlayer }).then((res) => {
            heroes = res;
        });
        return heroes;
    });
}
exports.FindHeroByIdUserPlayer = FindHeroByIdUserPlayer;
function FindHeroById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var hero;
        yield exports.HeroModel.findById(id).then((res) => {
            hero = Hero.Parse(res);
        });
        return hero;
    });
}
exports.FindHeroById = FindHeroById;
function UpdateHero(hero) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Dev 1687174057 ", hero);
        exports.HeroModel.updateOne({ _id: hero._id }, { Lv: hero.Lv, Gear: hero.Gear }).then((res) => {
            console.log("Dev 1685723761 ", res);
        });
    });
}
exports.UpdateHero = UpdateHero;
