import mongoose, { Types, Document } from "mongoose";
import { HeroEquipType } from "./HeroEquipType";
import { ResCode } from "../../Res/Model/ResCode";
import { HeroEquipCode } from "./HeroEquipCode";
import { QualityItemCode } from "../../QualityItem/QualityItem";
export declare class HeroWearEquip {
    IdHero: Types.ObjectId;
    IdHeroEquip: Types.ObjectId;
    static Parse(data: any): HeroWearEquip;
}
export declare class HeroEquipUpgradeLv {
    IdEquip: Types.ObjectId;
    NumberLv: number;
    static Parse(data: any): HeroEquipUpgradeLv;
}
export declare class CraftHeroEquip {
    ResCode: ResCode;
    static Parse(data: any): CraftHeroEquip;
}
export type HeroEquipDataDictionary = Record<string, HeroEquipData>;
export declare class HeroEquipData {
    Index: string;
    Code: HeroEquipCode;
    HeroEquipType: HeroEquipType;
    ModelName: string;
    QualityItemCode: QualityItemCode;
    IconName: string;
    IconBorderName: string;
    Power: number;
    Atk: number;
    Def: number;
    Agi: number;
    Dex: number;
    Hp: number;
    Crt: number;
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
    static Parse(data: any): HeroEquipData;
}
export type HeroEquipDictionary = Record<string, HeroEquip>;
export declare class HeroEquip extends Document {
    Code: HeroEquipCode;
    IdUserPlayer: Types.ObjectId;
    IdHero: string;
    Type: HeroEquipType;
    Lv: number;
    static New(code: HeroEquipCode, idUserPlayer: Types.ObjectId, type: HeroEquipType): HeroEquip;
    InitData(code: HeroEquipCode, idUserPlayer: Types.ObjectId, type: HeroEquipType): void;
}
export declare const HeroEquipModel: mongoose.Model<HeroEquip, {}, {}, {}, mongoose.Document<unknown, {}, HeroEquip> & Omit<HeroEquip & {
    _id: Types.ObjectId;
}, never>, any>;
