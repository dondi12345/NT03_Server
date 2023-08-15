import mongoose, { Schema, Types } from 'mongoose';
import { LogServer } from '../../LogServer/Controller/LogController';
import { LogCode } from '../../LogServer/Model/LogCode';
import { LogType } from '../../LogServer/Model/LogModel';

export const DataName = {
    DataHeroEquip : "DataHeroEquip"
}

export const dataCenterName = {
    DataHero: "DataHero",
    DataMonster: "DataMonster",
    DataBullet: "DataBullet",
    DataDamageEffect: "DataDamageEffect",
    DataHeroEquip: "DataHeroEquip",
}

export type DataVersionDictionary = Record<string, DataVersion>;

export class DataVersion{
    _id : Types.ObjectId;
    Name : string;
    Version : number = 0;
    Data : any[];

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

export async function GetDataVersionByName(name : string){
    return new Promise(async (resolve, reject)=>{
        await DataVersionModel.findOne({Name : name}).then((res)=>{
            resolve(res);
        }).catch((err)=>{
            LogServer(LogCode.DataCenter_NotFoundInDB, err, LogType.Error);
            reject(err);
        })
    })
}


