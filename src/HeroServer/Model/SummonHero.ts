import { Types } from "mongoose";
import { HeroCode } from "./HeroCode";
import { Hero } from "./Hero";

export interface ISummonHeroSlot{
    _id : Types.ObjectId;
    Hero : Hero,
    Hired : Boolean,
}

export class SummonHeroSlot implements ISummonHeroSlot{
    _id : Types.ObjectId = new Types.ObjectId();
    Hero : Hero;
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