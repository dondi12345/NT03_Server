import mongoose, { Schema, Types } from "mongoose";
import { HeroCode } from "./HeroCode";
import { FashionHero } from "./VariableHero";
import { GenderCode } from "./GenderCode";

export interface IHero{
    _id : Types.ObjectId,
    IdUserPlayer : Types.ObjectId,
    Lv : Number,
    HeroCode : HeroCode,
    HeroName : String,
    GenderCode : GenderCode,
    Eyes : Number,
    Eyebrow : Number,
    Hair : Number,
    HairColor : String,
    Mouths : Number,
}
export type HeroDictionary = Record<string, IHero>;

export class Hero implements IHero{
    _id: Types.ObjectId = new Types.ObjectId();
    IdUserPlayer: Types.ObjectId;
    Lv : Number;
    HeroCode : HeroCode;
    HeroName : String;
    GenderCode : GenderCode;
    Eyes : Number;
    Eyebrow : Number;
    Hair : Number;
    HairColor : String;
    Mouths : Number;

    static NewHero(data){
        var hero = new Hero();
        if(data._id) hero._id = data._id;
        else hero._id = new Types.ObjectId();

        if(data.Lv) hero.Lv = data.Lv;
        else hero.Lv = 1;

        if(data.HeroCode) hero.HeroCode = data.HeroCode;
        else hero.HeroCode = HeroCode.Dummy_WhiteItem;

        if(data.HeroName) hero.HeroName = data.HeroName;
        else hero.HeroName = FashionHero.FirstNames[Math.floor(Math.random() * FashionHero.FirstNames.length)]
                        +" "+FashionHero.LastNames[Math.floor(Math.random() * FashionHero.LastNames.length)];
        
        if(Math.random() > 0.5) {
            if(data.GenderCode) hero.GenderCode = data.GenderCode; else
            hero.GenderCode = GenderCode.Female;
            if(data.Eyes) hero.Eyes = data.Eyes; else
            hero.Eyes = FashionHero.FemaleEyes[Math.floor(Math.random() * FashionHero.FemaleEyes.length)]
            if(data.Hair) hero.Hair = data.Hair; else
            hero.Hair = FashionHero.FemaleHair[Math.floor(Math.random() * FashionHero.FemaleHair.length)]
        }else {
            if(data.GenderCode) hero.GenderCode = data.GenderCode; else
            hero.GenderCode = GenderCode.Male;
            if(data.Eyes) hero.Eyes = data.Eyes; else
            hero.Eyes = FashionHero.MaleEyes[Math.floor(Math.random() * FashionHero.MaleEyes.length)]
            if(data.Hair) hero.Hair = data.Hair; else
            hero.Hair = FashionHero.MaleHair[Math.floor(Math.random() * FashionHero.MaleHair.length)]
        }
        if(data.Eyebrow) hero.Eyebrow = data.Eyebrow; else
        hero.Eyebrow = FashionHero.Eyebrow[Math.floor(Math.random() * FashionHero.Eyebrow.length)]
        if(data.Mouths) hero.Mouths = data.Mouths; else
        hero.Mouths = FashionHero.Mouths[Math.floor(Math.random() * FashionHero.Mouths.length)]
        if(data.HairColor) hero.HairColor = data.HairColor; else
        hero.HairColor = FashionHero.HairColor[Math.floor(Math.random() * FashionHero.HairColor.length)]
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
        HeroCode : { type : Number, enum : HeroCode},
        HeroName : { type : String},
        Eyes : { type : Number},
        Eyebrow : { type : Number},
        Hair : { type : Number},
        HairColor : { type : String},
        Mouths : { type : Number},
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
    await HeroModel.find({IdUserPlayer : idUserPlayer}).then((res)=>{
        heroes = res;
    })
    return heroes;
}