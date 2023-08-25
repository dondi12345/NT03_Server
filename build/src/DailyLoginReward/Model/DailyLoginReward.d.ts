import mongoose, { Types } from 'mongoose';
export declare class DailyLoginReward {
    _id: Types.ObjectId;
    IdUser: Types.ObjectId;
    Year: number;
    Month: number;
    Day: number;
    Number: number;
    constructor();
    static Parse(data: any): DailyLoginReward;
}
export declare const DailyLoginRewardModel: mongoose.Model<DailyLoginReward, {}, {}, {}, mongoose.Document<unknown, {}, DailyLoginReward> & Omit<DailyLoginReward & Required<{
    _id: Types.ObjectId;
}>, never>, any>;
export declare function FindDailyLoginRewardByIdUser(idUser: Types.ObjectId): Promise<any>;
export declare function CreateDailyLoginReward(dailyLoginReward: DailyLoginReward): Promise<void>;
export declare function UpdateDailyLoginReward(dailyLoginReward: DailyLoginReward): Promise<void>;
