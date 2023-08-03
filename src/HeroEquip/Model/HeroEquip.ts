import mongoose, { Schema, Types } from "mongoose";
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
    Type : HeroEquipType;
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

export class HeroEquips{
    Elements : HeroEquip[] = [];
}

export interface IHeroEquip{
    _id : Types.ObjectId,
    Code : HeroEquipCode,
    IdUserPlayer: Types.ObjectId,
    IdHero ?: Types.ObjectId,
    Type : HeroEquipType,
    Lv : number,
}

export type HeroEquipDictionary = Record<string, IHeroEquip>;

export class HeroEquip implements IHeroEquip{
    _id : Types.ObjectId;
    Code : HeroEquipCode;
    IdUserPlayer: Types.ObjectId;
    IdHero ?: Types.ObjectId;
    Type : HeroEquipType;
    Lv : number;

    constructor(){
        this._id = new Types.ObjectId();
        this.Lv = 1;
    }

    static HeroEquip(code : HeroEquipCode, idUserPlayer : Types.ObjectId) {
        var heroEquip = new HeroEquip();
        var heroEquipData = heroEquipDataDictionary[code];
        heroEquip.Code = code;
        heroEquip.IdUserPlayer = idUserPlayer;
        heroEquip.Type = heroEquipData.Type;
        heroEquip.Lv = 1;
        console.log("Dev 1686842053 ", JSON.stringify(heroEquip));
        return heroEquip;
    }

    static Parse(data) : IHeroEquip{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }

    static ParseToType(index : string){
        var type = index[0] + index[1];
        if(type === "WP") return HeroEquipType.Weapon;
        if(type === "AR") return HeroEquipType.Armor;
        if(type === "HM") return HeroEquipType.Helmet;
        return HeroEquipType.Unknow;
    }
}

const HeroEquipSchema = new Schema<IHeroEquip>(
    {
        Code : { type : Number, enum : HeroEquipCode},
        IdUserPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPlayer' },
        IdHero: { type: mongoose.Schema.Types.ObjectId, ref: 'Hero'},
        Type : { type : Number, enum : HeroEquipType},
        Lv : { type : Number, default : 1},
    }
);

export const HeroEquipModel = mongoose.model<IHeroEquip>('HeroEquip', HeroEquipSchema);

export async function FindHeroEquipByIdUserPlayer(idUserPlayer: Types.ObjectId){
    var heroeEquips;
    await HeroEquipModel.find({IdUserPlayer : idUserPlayer}).then((res)=>{
        heroeEquips = res;
    })
    return heroeEquips;
}

export async function CreateHeroEquip(heroEquip : IHeroEquip){
    var data;
    await HeroEquipModel.create(heroEquip).then((res)=>{
        console.log("Dev 1685517259 "+ res)
        data = HeroEquip.Parse(res);
    }).catch((e)=>{
        LogServer(LogCode.HeroEquip_CreateNewFail, e, LogType.Error)
        console.log("Dev 1685517262 "+ e)
        data = null;
    })
    return data;
}

export async function UpdateHeroEquip(heroEquip:IHeroEquip) {
    console.log("Dev 1687173995 ", heroEquip);
    HeroEquipModel.updateOne({_id : heroEquip._id}, {IdHero : heroEquip.IdHero, Lv : heroEquip.Lv}).then((res)=>{
        console.log("Dev 1685723716 ", res);
    }).catch(err=>{
        LogServer(LogCode.HeroEquip_SaveFail, err, LogType.Error)

    })
}

export async function FindHeroEquipById(id : Types.ObjectId){
    var heroEquip;
    await HeroEquipModel.findById(id).then((res)=>{
        heroEquip = HeroEquip.Parse(res);
    })
    return heroEquip;
}