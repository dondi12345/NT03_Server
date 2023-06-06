import mongoose, { Schema, Types } from "mongoose";
import { HeroEquipType } from "./HeroEquipType";

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

export interface IHeroEquip{
    _id : Types.ObjectId,
    Index : String;
    IdUserPlayer: Types.ObjectId,
    IdHero ?: Types.ObjectId,
    HeroEquipType : HeroEquipType,
    Lv : Number,
}

export type HeroEquipDictionary = Record<string, IHeroEquip>;

export class HeroEquip implements IHeroEquip{
    _id : Types.ObjectId;
    Index : String;
    IdUserPlayer: Types.ObjectId;
    IdHero ?: Types.ObjectId;
    HeroEquipType : HeroEquipType;
    Lv : Number;

    constructor(){
        this._id = new Types.ObjectId();
        this.Lv = 1;
    }

    static Parse(data) : IHeroEquip{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }

    static ParseToHeroEquipType(id : string){
        var type = id[0] + id[1];
        if(type === "WP") return HeroEquipType.Weapon;
        if(type === "AR") return HeroEquipType.Armor;
        if(type === "HM") return HeroEquipType.Helmet;
        return HeroEquipType.Unknow;
    }
}

const HeroEquipSchema = new Schema<IHeroEquip>(
    {
        Index : { type : String},
        IdUserPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPlayer' },
        IdHero: { type: mongoose.Schema.Types.ObjectId, ref: 'Hero' },
        HeroEquipType : { type : Number, enum : HeroEquipType},
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
    HeroEquipModel.updateOne(heroEquip).then((res)=>{
        console.log("1685723716 "+res);
    })
}