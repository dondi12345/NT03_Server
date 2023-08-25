import { EffectCode } from "./EffectCode";
import mongoose, { Types } from 'mongoose';
export interface IRacingHourseData {
    EffectCodes: EffectCode[];
    TotalTime: number;
    Rank: number;
}
export declare class RacingHourseData implements IRacingHourseData {
    EffectCodes: EffectCode[];
    TotalTime: number;
    Rank: number;
}
export declare const RacingHourseDataSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    EffectCodes: any[];
    TotalTime: number;
    Rank?: number | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    EffectCodes: any[];
    TotalTime: number;
    Rank?: number | undefined;
}>> & Omit<mongoose.FlatRecord<{
    EffectCodes: any[];
    TotalTime: number;
    Rank?: number | undefined;
}> & {
    _id: Types.ObjectId;
}, never>>;
