import { Types } from "mongoose";
import { HeroCode } from "./HeroCode";

export interface ISummonHeroSlot{
    HeroCode : HeroCode,
    Hired : Boolean,
}

export class SummonHeroSlot implements ISummonHeroSlot{
    HeroCode : HeroCode;
    Hired : Boolean = false;
}

export interface ISummonHero{
    IdUserPlayer : Types.ObjectId,
    Slots : ISummonHeroSlot[],
}

export class SummonHero implements ISummonHero{
    IdUserPlayer : Types.ObjectId;
    Slots : ISummonHeroSlot[] = [];
}