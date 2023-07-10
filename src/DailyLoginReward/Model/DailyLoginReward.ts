import mongoose, { Schema, Types } from 'mongoose';

export class DailyLoginReward{
    _id : Types.ObjectId;
    IdUser : Types.ObjectId;
    Year : number = 0;
    Month : number = 0;
    Day : number = 0;
    Number : number = 0;

    constructor() {
        
    }

    static Parse(data) : DailyLoginReward{
        try{
            data = JSON.parse(data);
        }catch(err){}
        return data;
    }
}

const DailyLoginRewardSchema = new Schema<DailyLoginReward>(
    {
      _id : { type: Schema.Types.ObjectId, default: new Types.ObjectId()},
      IdUser : { type: Schema.Types.ObjectId, default: new Types.ObjectId()},
      Year :{type : Number, default: 0},
      Month :{type : Number, default: 0},
      Day :{type : Number, default: 0},
      Number :{type : Number, default: 0},
    }
);
  
export const DailyLoginRewardModel = mongoose.model<DailyLoginReward>('DailyLoginReward', DailyLoginRewardSchema);

export async function FindDailyLoginRewardByIdUser(idUser : Types.ObjectId){
    var dailyLoginReward;
    await DailyLoginRewardModel.findOne({IdUser : idUser}).then((res)=>{
        dailyLoginReward = DailyLoginReward.Parse(res);
    }).catch((err)=>{
        console.log(err);
    })
    return dailyLoginReward;
}

export async function CreateDailyLoginReward(dailyLoginReward:DailyLoginReward) {
    dailyLoginReward._id = new Types.ObjectId();
    await DailyLoginRewardModel.create(dailyLoginReward).then(res=>{
        console.log("Dev 1688969994 ", res);
    })
}