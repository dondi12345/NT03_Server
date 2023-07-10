import mongoose, { Schema, Types } from 'mongoose';

export type DataVersionDictionary = Record<string, DataVersion>;

export class DataVersion{
    _id : Types.ObjectId;
    Name : string;
    Version : number = 0;
    Data : any;

    static Parse(data) : DataVersion{
        try{
            data = JSON.parse(data);
        }catch(err){}
        return data;
    }
}

const DataVersionSchema = new Schema<DataVersion>(
    {
      _id : { type: Schema.Types.ObjectId, default: new Types.ObjectId()},
      Name :{type : String},
      Version :{type : Number},
      Data :{},
    }
);
  
export const DataVersionModel = mongoose.model<DataVersion>('DataVersion', DataVersionSchema);

export async function GetDataVersionByName(name : string, callback){
    await DataVersionModel.findOne({Name : name}).then((res)=>{
        callback.response = res
        callback.error = null
    }).catch((err)=>{
        callback.response = null
        callback.error = err
    })
}


