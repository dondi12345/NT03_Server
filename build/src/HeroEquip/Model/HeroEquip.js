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
exports.FindHeroEquipById = exports.UpdateHeroEquip = exports.CreateHeroEquip = exports.FindHeroEquipByIdUserPlayer = exports.HeroEquipModel = exports.HeroEquip = exports.HeroEquips = exports.DataHeroEquip = exports.CraftHeroEquip = exports.HeroEquipUpgradeLv = exports.HeroWearEquip = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const HeroEquipType_1 = require("./HeroEquipType");
const HeroEquipCode_1 = require("./HeroEquipCode");
const HeroEquipService_1 = require("../Service/HeroEquipService");
class HeroWearEquip {
    constructor() {
        this.IdHeroEquips = [];
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
class DataHeroEquip {
    static Parse(data) {
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return data;
        }
    }
}
exports.DataHeroEquip = DataHeroEquip;
class HeroEquips {
    constructor() {
        this.Elements = [];
    }
}
exports.HeroEquips = HeroEquips;
class HeroEquip {
    constructor() {
        this._id = new mongoose_1.Types.ObjectId();
        this.Lv = 1;
    }
    static HeroEquip(code, idUserPlayer) {
        var heroEquip = new HeroEquip();
        var dataHeroEquip = HeroEquipService_1.dataHeroEquipDictionary[code];
        heroEquip.Code = code;
        heroEquip.IdUserPlayer = idUserPlayer;
        heroEquip.Type = dataHeroEquip.Type;
        heroEquip.Lv = 1;
        console.log("Dev 1686842053 ", JSON.stringify(heroEquip));
        return heroEquip;
    }
    static Parse(data) {
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return data;
        }
    }
    static ParseToType(index) {
        var type = index[0] + index[1];
        if (type === "WP")
            return HeroEquipType_1.HeroEquipType.Weapon;
        if (type === "AR")
            return HeroEquipType_1.HeroEquipType.Armor;
        if (type === "HM")
            return HeroEquipType_1.HeroEquipType.Helmet;
        return HeroEquipType_1.HeroEquipType.Unknow;
    }
}
exports.HeroEquip = HeroEquip;
const HeroEquipSchema = new mongoose_1.Schema({
    Code: { type: Number, enum: HeroEquipCode_1.HeroEquipCode },
    IdUserPlayer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'UserPlayer' },
    IdHero: { type: String },
    Type: { type: Number, enum: HeroEquipType_1.HeroEquipType },
    Lv: { type: Number, default: 1 },
});
exports.HeroEquipModel = mongoose_1.default.model('HeroEquip', HeroEquipSchema);
function FindHeroEquipByIdUserPlayer(idUserPlayer) {
    return __awaiter(this, void 0, void 0, function* () {
        var heroeEquips;
        yield exports.HeroEquipModel.find({ IdUserPlayer: idUserPlayer }).then((res) => {
            heroeEquips = res;
        });
        return heroeEquips;
    });
}
exports.FindHeroEquipByIdUserPlayer = FindHeroEquipByIdUserPlayer;
function CreateHeroEquip(heroEquip) {
    return __awaiter(this, void 0, void 0, function* () {
        var data;
        yield exports.HeroEquipModel.create(heroEquip).then((res) => {
            console.log("Dev 1685517259 " + res);
            data = HeroEquip.Parse(res);
        }).catch((e) => {
            console.log("Dev 1685517262 " + e);
            data = null;
        });
        return data;
    });
}
exports.CreateHeroEquip = CreateHeroEquip;
function UpdateHeroEquip(heroEquip) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Dev 1687173995 ", heroEquip);
        exports.HeroEquipModel.updateOne({ _id: heroEquip._id }, { IdHero: heroEquip.IdHero, Lv: heroEquip.Lv }).then((res) => {
            console.log("Dev 1685723716 ", res);
        });
    });
}
exports.UpdateHeroEquip = UpdateHeroEquip;
function FindHeroEquipById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var heroEquip;
        yield exports.HeroEquipModel.findById(id).then((res) => {
            heroEquip = HeroEquip.Parse(res);
        });
        return heroEquip;
    });
}
exports.FindHeroEquipById = FindHeroEquipById;
