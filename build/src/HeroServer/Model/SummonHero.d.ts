import { Types } from "mongoose";
import { Hero } from "./Hero";
export interface ISummonHeroSlot {
    _id: Types.ObjectId;
    Hero: Hero;
    Hired: Boolean;
}
export declare class SummonHeroSlot implements ISummonHeroSlot {
    _id: Types.ObjectId;
    Hero: Hero;
    Hired: Boolean;
    static Parse(data: any): ISummonHeroSlot;
}
export declare class SummonHero {
    Version: string;
    Slots: SummonHeroSlot[];
}
