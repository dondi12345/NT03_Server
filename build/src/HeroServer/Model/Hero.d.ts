import mongoose, { Types, Document } from "mongoose";
import { HeroCode } from "./HeroCode";
import { GenderCode } from "./GenderCode";
import { HeroFashion } from "../../HeroFashion/HeroFashion";
export declare class HeroUpgradeLv {
    IdHero: Types.ObjectId;
    NumberLv: number;
    static Parse(data: any): HeroUpgradeLv;
}
export type DataHeroDictionary = Record<string, HeroData>;
export declare class HeroData {
    Index: string;
    Code: HeroCode;
    Power: number;
    Atk: number;
    Def: number;
    Agi: number;
    Dex: number;
    Hp: number;
    CrtRate: number;
    PowerRise: number;
    AtkRise: number;
    DefRise: number;
    AgiRise: number;
    DexRise: number;
    HpRise: number;
    CrtRateRise: number;
    CostUpgrade: number;
    CostUpgradeRise: number;
    static Parse(data: any): HeroData;
}
export declare class HeroGear {
    IdWeapon: string;
    IdArmor: string;
    IdHelmet: string;
}
export type HeroDictionary = Record<string, Hero>;
export declare class Hero extends Document {
    IdUserPlayer: Types.ObjectId;
    Lv: number;
    Code: HeroCode;
    HeroName: String;
    GenderCode: GenderCode;
    Eyes: HeroFashion;
    Eyebrow: HeroFashion;
    Hair: HeroFashion;
    Mouths: HeroFashion;
    HeroGear: HeroGear;
    constructor();
    InitData(idUserPlayer: any, heroCode: any): void;
}
export declare const HeroModel: mongoose.Model<Hero, {}, {}, {}, mongoose.Document<unknown, {}, Hero> & Omit<Hero & {
    _id: Types.ObjectId;
}, never>, any>;
