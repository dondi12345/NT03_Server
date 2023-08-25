import mongoose, { Types } from 'mongoose';
import { IRacingHourseData } from "./RacingHourseData";
export interface IResultRacingHourse {
    _id: Types.ObjectId;
    dateCreate: Date;
    racingHourseDatas?: IRacingHourseData[];
    dateRacing: Date;
}
export declare class ResultRacingHourse implements IResultRacingHourse {
    _id: Types.ObjectId;
    dateCreate: Date;
    racingHourseDatas: IRacingHourseData[];
    dateRacing: Date;
}
export declare const ResultRacingHourseModel: mongoose.Model<IResultRacingHourse, {}, {}, {}, mongoose.Document<unknown, {}, IResultRacingHourse> & Omit<IResultRacingHourse & Required<{
    _id: Types.ObjectId;
}>, never>, any>;
export declare function CreateResultRacingHourse(): Promise<mongoose.Document<unknown, {}, IResultRacingHourse> & Omit<IResultRacingHourse & Required<{
    _id: Types.ObjectId;
}>, never>>;
export declare function FindResultRacingHourse(_id: Types.ObjectId): Promise<any>;
export declare function UpdateResultRacingHourse(resultRacingHourse: IResultRacingHourse): Promise<void>;
export declare function GetNewestResultRacingHourse(): Promise<any>;
