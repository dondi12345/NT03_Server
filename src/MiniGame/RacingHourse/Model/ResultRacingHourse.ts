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
    var id = _id.path;
    var data;
    await ResultRacingHourseModel.findOne({_id : id}).then((res)=>{
        data = res;
    })
    console.log(data._id);
    return data;
}

export async function UpdateResultRacingHourse(resultRacingHourse : ResultRacingHourse){
    await ResultRacingHourseModel.findByIdAndUpdate(resultRacingHourse._id, resultRacingHourse).then(res=>{
        console.log(res);
    });
}

export async function GetNewestResultRacingHourse(){
    const maxVal = await ResultRacingHourseModel.aggregate([
        { $group: {_id : null, maxField: { $max: '$dateCreate' } } }
    ]).exec();
    ResultRacingHourseModel.find({dateCreate : maxVal[0].maxField}).then(res=>{
        console.log(res);
    })
}

