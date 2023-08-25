import mongoose, { Types } from "mongoose";
import { ResCode } from "./ResCode";
import { QualityItemCode } from "../../QualityItem/QualityItem";
import { ResType } from "./ResType";
export declare class Reses {
    Elements: IRes[];
}
export type ResDataDictionary = Record<string, ResData>;
export declare class ResData {
    Code: ResCode;
    Type: ResType;
    QualityItemCode: QualityItemCode;
    Price: number;
    CanSell: boolean;
    IconName: string;
    IconBorderName: string;
    CraftHeroEquip: number;
    static Parse(data: any): ResData;
}
export type ResDictionary = Record<string, IRes>;
export interface IRes {
    _id: Types.ObjectId;
    Code: ResCode;
    IdUserPlayer: Types.ObjectId;
    Number: number;
}
export declare class Res implements IRes {
    _id: Types.ObjectId;
    Code: ResCode;
    IdUserPlayer: Types.ObjectId;
    Number: number;
    constructor(resCode: ResCode, idUserPlayer: Types.ObjectId, number: number);
    static Parse(data: any): IRes;
}
export declare const ResModel: mongoose.Model<IRes, {}, {}, {}, mongoose.Document<unknown, {}, IRes> & Omit<IRes & Required<{
    _id: Types.ObjectId;
}>, never>, any>;
export declare function CreateRes(res: IRes): Promise<any>;
export declare function FindResByIdUserPlayer(idUserPlayer: Types.ObjectId): Promise<any>;
export declare function FindItemByIdUserPlayerAndCode(idUserPlayer: Types.ObjectId, code: ResCode): Promise<any>;
export declare function UpdateRes(res: IRes): Promise<void>;
