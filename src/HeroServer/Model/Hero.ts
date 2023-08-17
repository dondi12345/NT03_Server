import mongoose, { Schema, Types, Document } from "mongoose";
import { HeroCode } from "./HeroCode";
import { GenderCode } from "./GenderCode";
import { HeroFashion, HeroFashionVar } from "../../HeroFashion/HeroFashion";

export class HeroUpgradeLv{
    IdHero : Types.ObjectId;
    NumberLv : number;

    static Parse(data) : HeroUpgradeLv{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}

export type DataHeroDictionary = Record<string, HeroData>;

export class HeroData{
    Index : string;
    Code : HeroCode;
    Power : number;
    Atk : number;
    Def : number;
    Agi : number;
    Dex : number;
    Hp : number;
    CrtRate : number;
    PowerRise : number;
    AtkRise : number;
    DefRise : number;
    AgiRise : number;
    DexRise : number;
    HpRise : number;
    CrtRateRise : number;
    CostUpgrade : number;
    CostUpgradeRise : number;

    static Parse(data) : HeroData{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}

export class HeroGear{
    IdWeapon : string = "";
    IdArmor : string = "";
    IdHelmet : string = "";
}

export type HeroDictionary = Record<string, Hero>;

export class Hero extends Document{
    IdUserPlayer: Types.ObjectId;
    Lv : number;
    Code : HeroCode;
    HeroName : String;
    GenderCode : GenderCode;
    Eyes : HeroFashion;
    Eyebrow : HeroFashion;
    Hair : HeroFashion;
    Mouths : HeroFashion;
    HeroGear : HeroGear;

    constructor() {
        super();
        this._id = new Types.ObjectId();
        this.Lv = 1;
        this.Code = HeroCode.Unknown;
        this.HeroName = HeroFashionVar.FirstNames[Math.floor(Math.random() * HeroFashionVar.FirstNames.length)]
                      +" "+HeroFashionVar.LastNames[Math.floor(Math.random() * HeroFashionVar.LastNames.length)];
        this.GenderCode = Math.random() < 0.5 ? GenderCode.Male : GenderCode.Female;
        if(this.GenderCode == GenderCode.Male ){
            this.Eyes = HeroFashion.NewHeroFashion(HeroFashionVar.MaleEyes[Math.floor(Math.random() * HeroFashionVar.MaleEyes.length)])
            this.Hair = HeroFashion.NewHeroFashion(HeroFashionVar.MaleHair[Math.floor(Math.random() * HeroFashionVar.MaleHair.length)],
                                                HeroFashionVar.Color[Math.floor(Math.random() * HeroFashionVar.Color.length)]);
        }else{
            this.Eyes = HeroFashion.NewHeroFashion(HeroFashionVar.FemaleEyes[Math.floor(Math.random() * HeroFashionVar.FemaleEyes.length)])
            this.Hair = HeroFashion.NewHeroFashion(HeroFashionVar.FemaleHair[Math.floor(Math.random() * HeroFashionVar.FemaleHair.length)],
                                                HeroFashionVar.Color[Math.floor(Math.random() * HeroFashionVar.Color.length)]);
        }
        this.Eyebrow = HeroFashion.NewHeroFashion(HeroFashionVar.Eyebrow[Math.floor(Math.random() * HeroFashionVar.Eyebrow.length)]);                            
        this.Mouths = HeroFashion.NewHeroFashion(HeroFashionVar.Mouths[Math.floor(Math.random() * HeroFashionVar.Mouths.length)]);
    }
    
    InitData(idUserPlayer, heroCode){
        this.IdUserPlayer = idUserPlayer;
        this.Code = heroCode;
    }
}

const HeroSchema = new Schema<Hero>(
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
        HeroGear : {
            IdWeapon : { type : String, default : ""},
            IdArmor : { type : String, default : "" },
            IdHelmet : { type : String, default : "" },
        }
    }
);

export const HeroModel = mongoose.model<Hero>('Hero', HeroSchema);