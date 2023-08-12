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

export class SummonHero{
    Version : string;
    Slots : SummonHeroSlot[];
}