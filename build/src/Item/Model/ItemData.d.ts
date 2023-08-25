import { ItemCode } from "./ItemCode";
export declare enum QualityItemCode {
    White = 1,
    Green = 2,
    Blue = 3,
    Purple = 4,
    Yellow = 5,
    Red = 6,
    Orange = 7
}
export declare enum ItemType {
    Unknown = 0,
    SummonHero = 1001,
    CraftHeroEquip_BP = 2001,
    CraftHeroEquip_SP = 2002
}
export declare class ItemData {
    Index: string;
    Code: ItemCode;
    Price: number;
    CanSell: boolean;
    QualityItemCode: QualityItemCode;
    ItemType: ItemType;
    IconName: string;
    IconBorderName: string;
    CraftHeroEquip: number;
}
