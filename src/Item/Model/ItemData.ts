import { ItemCode } from "./ItemCode";

export enum QualityItemCode{
    White = 1,
    Green = 2,
    Blue = 3,
    Purple = 4,
    Yellow = 5,
    Red = 6,
    Orange = 7,
}

export enum ItemType
{
    Unknown = 0,

    //Item
    SummonHero = 1001,
    CraftHeroEquip_BP = 2001,
    CraftHeroEquip_SP = 2002,
}

export class ItemData
{
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