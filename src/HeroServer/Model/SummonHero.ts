import { Types } from "mongoose";
import { HeroCode } from "./HeroCode";
import { Hero, IHero } from "./Hero";

export interface ISummonHeroSlot{
    _id : Types.ObjectId;
    Hero : IHero,
    Hired : Boolean,
}

export class SummonHeroSlot implements ISummonHeroSlot{
    _id : Types.ObjectId = new Types.ObjectId();
    Hero : IHero;
    Hired : Boolean = false;

    static Parse(data) : ISummonHeroSlot{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}

export interface ISummonHero{
    _id : Types.ObjectId,
    IdUserPlayer : Types.ObjectId,
    Slots : SummonHeroSlot[],
}

export class SummonHero implements ISummonHero{
    _id : Types.ObjectId = new Types.ObjectId();
    IdUserPlayer : Types.ObjectId;
    Slots : SummonHeroSlot[];
    static Parse(data) : ISummonHero{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}