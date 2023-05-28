import { Types } from "mongoose";
import { HeroCode } from "./HeroCode";

export interface ISummonHeroSlot{
    _id : Types.ObjectId,
    HeroCode : HeroCode,
    Hired : Boolean,
}

export class SummonHeroSlot implements ISummonHeroSlot{
    _id : Types.ObjectId = new Types.ObjectId();
    HeroCode : HeroCode;
    Hired : Boolean = false;
}

export type SummonHeroSlotDictionary = Record<string, SummonHeroSlot>;

export interface ISummonHero{
    _id : Types.ObjectId,
    IdUserPlayer : Types.ObjectId,
    Slots : SummonHeroSlotDictionary,
}

export class SummonHero implements ISummonHero{
    _id : Types.ObjectId = new Types.ObjectId();
    IdUserPlayer : Types.ObjectId;
    Slots : SummonHeroSlotDictionary = {};
    static Parse(data) : ISummonHero{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}