import mongoose, { Types } from "mongoose";
export interface ICurrency {
    IdUserPlayer: Types.ObjectId;
    Diamond: number;
    Money: number;
    Food: number;
    Gold: number;
    Silver: number;
    EnchanceStone: number;
    MagicStone: number;
    HeroScroll_White: number;
    BlueprintHeroEquip_White: number;
}
export declare class Currency implements ICurrency {
    IdUserPlayer: Types.ObjectId;
    Diamond: number;
    Money: number;
    Food: number;
    Gold: number;
    Silver: number;
    EnchanceStone: number;
    MagicStone: number;
    HeroScroll_White: number;
    BlueprintHeroEquip_White: number;
    constructor();
    static Parse(data: any): ICurrency;
}
export declare const CurrencyModel: mongoose.Model<ICurrency, {}, {}, {}, mongoose.Document<unknown, {}, ICurrency> & Omit<ICurrency & {
    _id: Types.ObjectId;
}, never>, any>;
export declare function CreateUserPlayerCurrency(data: ICurrency): Promise<any>;
export declare function FindCurrencyByIdUserPlayer(idUserPlayer: Types.ObjectId): Promise<any>;
export declare function UpdateCurrency(currency: ICurrency, idUserPlayer: Types.ObjectId): Promise<void>;
export declare function IncreaseNumber(nameCurrency: string, number: number, idUserPlayer: Types.ObjectId): Promise<void>;
