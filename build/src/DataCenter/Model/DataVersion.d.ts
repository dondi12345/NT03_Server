import mongoose, { Types } from 'mongoose';
export declare const DataName: {
    DataHeroEquip: string;
};
export declare const dataCenterName: {
    DataHero: string;
    DataMonster: string;
    DataBullet: string;
    DataDamageEffect: string;
    DataHeroEquip: string;
    DataQualityItem: string;
    DataItem: string;
};
export type DataVersionDictionary = Record<string, DataVersion>;
export declare class DataVersion {
    _id: Types.ObjectId;
    Name: string;
    Version: number;
    Data: any[];
    static Parse(data: any): DataVersion;
}
export declare const DataVersionModel: mongoose.Model<DataVersion, {}, {}, {}, mongoose.Document<unknown, {}, DataVersion> & Omit<DataVersion & Required<{
    _id: Types.ObjectId;
}>, never>, any>;
export declare function GetDataVersionByName(name: string): Promise<unknown>;
