import { EffectCode } from "./EffectCode";
import mongoose, { Schema,Types } from 'mongoose'

export interface IRacingHourseData{
    effectCodes : EffectCode[];
    totalTime : number;
    rank : number;
}

export class RacingHourseData implements IRacingHourseData {
    effectCodes : EffectCode[] = [];
    totalTime : number = 0;
    rank : number;
}

export const RacingHourseDataSchema = new Schema({
    effectCodes : {type : []},
    totalTime: { type: Number, default: 0 },
    rank: { type: Number }
  });

