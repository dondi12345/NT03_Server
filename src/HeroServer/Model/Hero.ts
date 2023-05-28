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

export class Hero implements IHero{
    _id: Types.ObjectId;
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

    static NewHero(){
        var hero = new Hero();
        hero.Lv = 1;
        hero.HeroCode = HeroCode.Dummy_WhiteItem;
        hero.HeroName = FashionHero.FirstNames[Math.floor(Math.random() * FashionHero.FirstNames.length)]
                        +" "+FashionHero.LastNames[Math.floor(Math.random() * FashionHero.LastNames.length)];
        if(Math.random() > 0.5) {
            hero.GenderCode = GenderCode.Female;
            hero.Eyes = FashionHero.FemaleEyes[Math.floor(Math.random() * FashionHero.FemaleEyes.length)]
            hero.Hair = FashionHero.FemaleHair[Math.floor(Math.random() * FashionHero.FemaleHair.length)]
        }else {
            hero.GenderCode = GenderCode.Male;
            hero.Eyes = FashionHero.MaleEyes[Math.floor(Math.random() * FashionHero.MaleEyes.length)]
            hero.Hair = FashionHero.MaleHair[Math.floor(Math.random() * FashionHero.MaleHair.length)]
        }
        hero.Eyebrow = FashionHero.Eyebrow[Math.floor(Math.random() * FashionHero.Eyebrow.length)]
        hero.Mouths = FashionHero.Mouths[Math.floor(Math.random() * FashionHero.Mouths.length)]
        hero.HairColor = FashionHero.HairColor[Math.floor(Math.random() * FashionHero.HairColor.length)]
        return hero;
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