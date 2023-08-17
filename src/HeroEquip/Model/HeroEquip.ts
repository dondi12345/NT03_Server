import mongoose, { Schema, Types, Document } from "mongoose";
import { HeroEquipType } from "./HeroEquipType";
import { ResCode } from "../../Res/Model/ResCode";
import { HeroEquipCode } from "./HeroEquipCode";
import { QualityItemCode } from "../../QualityItem/QualityItem";
import { HeroCode } from "../../HeroServer/Model/HeroCode";
import { heroEquipDataDictionary } from "../Service/HeroEquipService";
import { LogServer } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { LogType } from "../../LogServer/Model/LogModel";

export class HeroWearEquip{
    IdHero : Types.ObjectId;
    IdHeroEquip : Types.ObjectId;

    static Parse(data) : HeroWearEquip{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}

export class HeroEquipUpgradeLv{
    IdEquip : Types.ObjectId;
    NumberLv : number;

    static Parse(data) : HeroEquipUpgradeLv{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}

export class CraftHeroEquip{
    ResCode : ResCode;

    static Parse(data) : CraftHeroEquip{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}
export type HeroEquipDataDictionary = Record<string, HeroEquipData>;

export class HeroEquipData{
    Index : string; 
    Code : HeroEquipCode;
    HeroEquipType : HeroEquipType;
    ModelName : string;
    QualityItemCode : QualityItemCode;
    IconName : string;
    IconBorderName : string;

    Power : number;
    Atk : number;
    Def : number;
    Agi : number;
    Dex : number;
    Hp : number;
    Crt : number;
    CrtRate : number;

    PowerRise: number;
    AtkRise: number;
    DefRise: number;
    AgiRise: number;
    DexRise: number;
    HpRise: number;
    CrtRateRise: number;

    CostUpgrade: number;
    CostUpgradeRise: number;

    static Parse(data) : HeroEquipData{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}

export type HeroEquipDictionary = Record<string, HeroEquip>;

export class HeroEquip extends Document{
    Code : HeroEquipCode;
    IdUserPlayer: Types.ObjectId;
    IdHero : string;
    Type : HeroEquipType;
    Lv : number = 1;

    static New(code : HeroEquipCode, idUserPlayer : Types.ObjectId, type: HeroEquipType) {
        var heroEquip = new HeroEquip();
        heroEquip.InitData(code,idUserPlayer,type);
        heroEquip.Lv = 1;
        return heroEquip;
    }

    InitData(code : HeroEquipCode, idUserPlayer : Types.ObjectId, type: HeroEquipType){
        this.Code = code;
        this.IdUserPlayer = idUserPlayer;
        this.Type = type;
    }
    
}

const HeroEquipSchema = new Schema<HeroEquip>(
    {
        Code : { type : Number, enum : HeroEquipCode},
        IdUserPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPlayer' },
        IdHero: { type: String, default : ""},
        Type : { type : Number, enum : HeroEquipType},
        Lv : { type : Number, default : 1},
    }
);

export const HeroEquipModel = mongoose.model<HeroEquip>('HeroEquip', HeroEquipSchema);