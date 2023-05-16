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

export async function FindResultRacingHourse(_id : ObjectId) {
    console.log(_id);
    var data;
    await ResultRacingHourseModel.findById(_id).then((res)=>{
        data = res;
        console.log("FindResultRacingHourse: \n"+ res);
    })
    return data;
}

export async function UpdateResultRacingHourse(resultRacingHourse : ResultRacingHourse){
    console.log("UpdateResultRacingHourse:\n"+resultRacingHourse+"\n"+resultRacingHourse.dateCreate);
    await FindResultRacingHourse(resultRacingHourse._id);
    await ResultRacingHourseModel.findByIdAndUpdate(resultRacingHourse._id, resultRacingHourse).then(res=>{
        console.log("UpdateResultRacingHourse:\n"+res);
    });
}

export async function GetNewestResultRacingHourse(){
    var data;
    const maxVal = await ResultRacingHourseModel.aggregate([
        { $group: {_id : null, maxField: { $max: '$dateCreate' } } }
    ]).exec();
    await ResultRacingHourseModel.find({dateCreate : maxVal[0].maxField}).then(res=>{
        console.log("GetNewestResultRacingHourse:\n" + res);
        data = res;
    })
    return data;
}

