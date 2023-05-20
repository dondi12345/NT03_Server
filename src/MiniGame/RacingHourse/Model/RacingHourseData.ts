import { EffectCode } from "./EffectCode";
import mongoose, { Schema,Types } from 'mongoose'

export interface IRacingHourseData{
    EffectCodes : EffectCode[];
    TotalTime : number;
    Rank : number;
}

export class RacingHourseData implements IRacingHourseData {
    EffectCodes : EffectCode[] = [];
    TotalTime : number = 0;
    Rank : number;
}

export const RacingHourseDataSchema = new Schema({
    EffectCodes : {type : []},
    TotalTime: { type: Number, default: 0 },
    Rank: { type: Number }
  });

