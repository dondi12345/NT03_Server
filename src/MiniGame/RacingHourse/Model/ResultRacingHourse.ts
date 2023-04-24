import mongoose, { Schema, ObjectId } from 'mongoose';
import { RacingHourseData } from "./RacingHourseData";
import { ChatChannelModel } from '../../../Chat/Model/ChatChannel';

export interface IResultRacingHourse{
    _id : ObjectId;
    dateCreate : Date;
    racingHourseDatas ?: RacingHourseData[];
    dateRacing : Date;
}

export class ResultRacingHourse implements IResultRacingHourse{
    _id : ObjectId;
    dateCreate : Date;
    racingHourseDatas : RacingHourseData[];
    dateRacing : Date;
}

const ResultRacingHourseSchema = new Schema<IResultRacingHourse>(
    {
      dateCreate : {type : Date},
      racingHourseDatas : {type : []},
      dateRacing : {type : Date},
    }
);
  
export const ResultRacingHourseModel = mongoose.model<IResultRacingHourse>('ResultRacingHourse', ResultRacingHourseSchema);

export async function CreateResultRacingHourse(){
    var resultRacingHourse = new ResultRacingHourseModel();
    resultRacingHourse.dateCreate = new Date();
    await ResultRacingHourseModel.create(resultRacingHourse).then((res) => {
        resultRacingHourse = res;
    }).catch((err)=>{
        throw err;
    })
    return resultRacingHourse;
}