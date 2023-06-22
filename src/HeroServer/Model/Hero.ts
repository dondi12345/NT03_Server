import mongoose, { Schema, Types } from "mongoose";
import { HeroCode } from "./HeroCode";
import { GenderCode } from "./GenderCode";
import { HeroFashion, HeroFashionVar } from "../../HeroFashion/HeroFashion";
import { HeroEquip } from "../../HeroEquip/Model/HeroEquip";
import { HeroEquipType } from "../../HeroEquip/Model/HeroEquipType";

export interface IGear{
    IdWeapon ?: string,
    IdArmor ?: string,
    IdHelmet ?: string,
}

export class Gear implements IGear{
    IdWeapon ?: string;
    IdArmor ?: string;
    IdHelmet ?: string;
}

export class Heroes{
    Elements : Hero[] = [];
}

export interface IHero{
    _id : Types.ObjectId,
    IdUserPlayer : Types.ObjectId,
    Lv : Number,
    Code : HeroCode,
    HeroName : String,
    GenderCode : GenderCode,
    Eyes : HeroFashion,
    Eyebrow : HeroFashion,
    Hair : HeroFashion,
    Mouths : HeroFashion,
    Gear : Gear,
}
export type HeroDictionary = Record<string, IHero>;

export class Hero implements IHero{
    _id: Types.ObjectId = new Types.ObjectId();
    IdUserPlayer: Types.ObjectId;
    Lv : Number;
    Code : HeroCode;
    HeroName : String;
    GenderCode : GenderCode;
    Eyes : HeroFashion;
    Eyebrow : HeroFashion;
    Hair : HeroFashion;
    Mouths : HeroFashion;
    Gear : Gear;

    constructor() {
        this._id = new Types.ObjectId();
        this.Lv = 1;
        this.Code = HeroCode.Unknown;
        this.HeroName = HeroFashionVar.FirstNames[Math.floor(Math.random() * HeroFashionVar.FirstNames.length)]
                      +" "+HeroFashionVar.LastNames[Math.floor(Math.random() * HeroFashionVar.LastNames.length)];
        this.GenderCode = Math.random() < 0.5 ? GenderCode.Male : GenderCode.Female;
        if(this.GenderCode == GenderCode.Male ){
            this.Eyes = HeroFashion.NewHero(HeroFashionVar.FemaleEyes[Math.floor(Math.random() * HeroFashionVar.FemaleEyes.length)])
            this.Hair = HeroFashion.NewHero1(HeroFashionVar.FemaleHair[Math.floor(Math.random() * HeroFashionVar.FemaleHair.length)],
                                                HeroFashionVar.Color[Math.floor(Math.random() * HeroFashionVar.Color.length)]);
        }else{
            this.Eyes = HeroFashion.NewHero(HeroFashionVar.MaleEyes[Math.floor(Math.random() * HeroFashionVar.MaleEyes.length)])
            this.Hair = HeroFashion.NewHero1(HeroFashionVar.MaleHair[Math.floor(Math.random() * HeroFashionVar.MaleHair.length)],
                                                HeroFashionVar.Color[Math.floor(Math.random() * HeroFashionVar.Color.length)]);
        }
        this.Eyebrow = HeroFashion.NewHero(HeroFashionVar.Eyebrow[Math.floor(Math.random() * HeroFashionVar.Eyebrow.length)]);                            
        this.Mouths = HeroFashion.NewHero(HeroFashionVar.Mouths[Math.floor(Math.random() * HeroFashionVar.Mouths.length)]);
    }

    static NewHero(data){
        var hero = new Hero();
        if(data._id) hero._id = data._id;
        if(data.IdUserPlayer) hero.IdUserPlayer = data.IdUserPlayer;
        if(data.Lv) hero.Lv = data.Lv;
        if(data.HeroCode) hero.Code = data.HeroCode;
        if(data.HeroName) hero.HeroName = data.HeroName;
        if(data.GenderCode) hero.GenderCode = data.GenderCode
        if(data.Eyes) hero.Eyes = data.Eyes;
        if(data.Eyebrow) hero.Eyebrow = data.Eyebrow;
        if(data.Hair) hero.Hair = data.Hair;
        if(data.Mouths) hero.Mouths = data.Mouths;
        return hero;
    }

    static Parse(data) : IHero{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}

const HeroSchema = new Schema<IHero>(
    {
        IdUserPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPlayer' },
        Lv : { type : Number, default : 1},
        Code : { type : Number, enum : HeroCode},
        GenderCode : { type : Number, enum : GenderCode},
        HeroName : { type : String},
        Eyes : { Index : { type : String}, Color : { type : String}, },
        Eyebrow : { Index : { type : String}, Color : { type : String}, },
        Hair : { Index : { type : String}, Color : { type : String}, },
        Mouths : { Index : { type : String}, Color : { type : String}, },
        Gear :{
            IdWeapon : { type : String},
            IdArmor : { type : String},
            IdHelmet : { type : String},
        }
    }
);

export const HeroModel = mongoose.model<IHero>('Hero', HeroSchema);

export async function CreateHero(hero : IHero){
    var data;
    await HeroModel.create(hero).then((res)=>{
        console.log("1685285706 "+ res)
        data = Hero.Parse(res);
    }).catch((e)=>{
        console.log("1685285714 "+ e)
        data = null;
    })
    return data;
}

export async function FindHeroByIdUserPlayer(idUserPlayer: Types.ObjectId){
    var heroes;
    await HeroModel.find({IdUserPlayer : idUserPlayer}).then((res : [])=>{
        heroes = res;
    })
    return heroes;
}

export async function FindHeroById(id : Types.ObjectId){
    var hero;
    await HeroModel.findById(id).then((res)=>{
        hero = Hero.Parse(res);
    })
    return hero;
}

export async function UpdateHero(hero:IHero) {
    console.log("1687174057 ", hero);
    HeroModel.updateOne({_id : hero._id},{Lv : hero.Lv, Gear : hero.Gear}).then((res)=>{
        console.log("1685723760 ",res);
    })
}