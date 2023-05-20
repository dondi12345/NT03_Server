import mongoose, { Schema,Types } from 'mongoose';
import { IRacingHourseData, RacingHourseData, RacingHourseDataSchema } from "./RacingHourseData";

export interface IResultRacingHourse{
    _id : Types.ObjectId;
    dateCreate : Date;
    racingHourseDatas ?: IRacingHourseData[];
    dateRacing : Date;
}

export class ResultRacingHourse implements IResultRacingHourse{
    _id : Types.ObjectId;
    dateCreate : Date;
    racingHourseDatas : IRacingHourseData[];
    dateRacing : Date;
}

const ResultRacingHourseSchema = new Schema<IResultRacingHourse>({
    _id : { type: Schema.Types.ObjectId, default: new Types.ObjectId()},
    dateCreate : {type : Date},
    racingHourseDatas : {type : [RacingHourseDataSchema], default: []},
    dateRacing : {type : Date},
  });
  
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

export async function FindResultRacingHourse(_id : Types.ObjectId) {
    var id = _id;
    var data;
    await ResultRacingHourseModel.findById(_id).then((res)=>{
        data = res;
        console.log("FindResultRacingHourse: \n"+ res);
    })
    return data;
}

export async function UpdateResultRacingHourse(resultRacingHourse : IResultRacingHourse){
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

