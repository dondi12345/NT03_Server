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
exports.HeroEquipModel = exports.HeroEquip = exports.HeroEquipData = exports.CraftHeroEquip = exports.HeroEquipUpgradeLv = exports.HeroWearEquip = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const HeroEquipType_1 = require("./HeroEquipType");
const HeroEquipCode_1 = require("./HeroEquipCode");
class HeroWearEquip {
    static Parse(data) {
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return data;
        }
    }
}
exports.HeroWearEquip = HeroWearEquip;
class HeroEquipUpgradeLv {
    static Parse(data) {
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return data;
        }
    }
}
exports.HeroEquipUpgradeLv = HeroEquipUpgradeLv;
class CraftHeroEquip {
    static Parse(data) {
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return data;
        }
    }
}
exports.CraftHeroEquip = CraftHeroEquip;
class HeroEquipData {
    static Parse(data) {
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return data;
        }
    }
}
exports.HeroEquipData = HeroEquipData;
class HeroEquip extends mongoose_1.Document {
    constructor() {
        super(...arguments);
        this.Lv = 1;
    }
    static New(code, idUserPlayer, type) {
        var heroEquip = new HeroEquip();
        heroEquip.InitData(code, idUserPlayer, type);
        heroEquip.Lv = 1;
        return heroEquip;
    }
    InitData(code, idUserPlayer, type) {
        this.Code = code;
        this.IdUserPlayer = idUserPlayer;
        this.Type = type;
    }
}
exports.HeroEquip = HeroEquip;
const HeroEquipSchema = new mongoose_1.Schema({
    Code: { type: Number, enum: HeroEquipCode_1.HeroEquipCode },
    IdUserPlayer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'UserPlayer' },
    IdHero: { type: String, default: "" },
    Type: { type: Number, enum: HeroEquipType_1.HeroEquipType },
    Lv: { type: Number, default: 1 },
});
exports.HeroEquipModel = mongoose_1.default.model('HeroEquip', HeroEquipSchema);
