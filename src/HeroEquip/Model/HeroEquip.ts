import mongoose, { Schema, Types } from "mongoose";
import { HeroEquipType } from "./HeroEquipType";
import { ResCode } from "../../Res/Model/ResCode";
import { HeroEquipCode } from "./HeroEquipCode";
import { QualityItemCode } from "../../QualityItem/QualityItem";
import { HeroCode } from "../../HeroServer/Model/HeroCode";
import { dataHeroEquipDictionary } from "../Service/HeroEquipService";

export class HeroWearEquip{
    IdHero : Types.ObjectId;
    IdHeroEquips : Types.ObjectId[] = [];

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
export type DataHeroEquipDictionary = Record<string, DataHeroEquip>;

export class DataHeroEquip{
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

    static Parse(data) : DataHeroEquip{
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
    IdHero ?: string,
    Type : HeroEquipType,
    Lv : number,
}

export type HeroEquipDictionary = Record<string, IHeroEquip>;

export class HeroEquip implements IHeroEquip{
    _id : Types.ObjectId;
    Code : HeroEquipCode;
    IdUserPlayer: Types.ObjectId;
    IdHero ?: string;
    Type : HeroEquipType;
    Lv : number;

    constructor(){
        this._id = new Types.ObjectId();
        this.Lv = 1;
    }

    static HeroEquip(code : HeroEquipCode, idUserPlayer : Types.ObjectId) {
        var heroEquip = new HeroEquip();
        var dataHeroEquip = dataHeroEquipDictionary[code];
        heroEquip.Code = code;
        heroEquip.IdUserPlayer = idUserPlayer;
        heroEquip.Type = dataHeroEquip.Type;
        heroEquip.Lv = 1;
        console.log("1686842053 ", JSON.stringify(heroEquip));
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
        IdHero: { type: String},
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
        console.log("1685517259 "+ res)
        data = HeroEquip.Parse(res);
    }).catch((e)=>{
        console.log("1685517262 "+ e)
        data = null;
    })
    return data;
}

export async function UpdateHeroEquip(heroEquip:IHeroEquip) {
    console.log("1687173995 ", heroEquip);
    HeroEquipModel.updateOne({_id : heroEquip._id}, {IdHero : heroEquip.IdHero, Lv : heroEquip.Lv}).then((res)=>{
        console.log("1685723716 ", res);
    })
}

export async function FindHeroEquipById(id : Types.ObjectId){
    var heroEquip;
    await HeroEquipModel.findById(id).then((res)=>{
        heroEquip = HeroEquip.Parse(res);
    })
    return heroEquip;
}