import mongoose, { Schema, Types } from "mongoose";
import { ResCode } from "./ResCode";

export class Reses{
    Elements : IRes[] = [];
}

export type DataResDictionary = Record<string, DataRes>;

export class DataRes{
    ResCode : ResCode;
    Name : string;
    Price : number;
    CanSell : boolean;
    QualityItemCode : string;
    IconName : string;
    IconBorderName : string;
    CraftHeroEquip : number;

    static Parse(data) : DataRes{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}

export type ResDictionary = Record<string, IRes>;

export interface IRes{
    _id : Types.ObjectId,
    Name : String,
    ResCode : ResCode,
    IdUserPlayer : Types.ObjectId,
    Number : number,
}

export class Res implements IRes{
    _id : Types.ObjectId;
    Name : String;
    ResCode : ResCode;
    IdUserPlayer : Types.ObjectId;
    Number : number;

    constructor(resCode: ResCode, idUserPlayer : Types.ObjectId, number : number){
        this.ResCode= resCode;
        this.IdUserPlayer = idUserPlayer;
        this.Number = number;
    }

    static Parse(data) : IRes{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}

const ResSchema = new Schema<IRes>(
    {

        Name : { type : String},
        ResCode : { type : Number, enum : ResCode},
        IdUserPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPlayer' },
        Number : { type : Number, default : 0},
    }
);

export const ResModel = mongoose.model<IRes>('Res', ResSchema);

export async function CreateRes(res : IRes){
    var data;
    await ResModel.create(res).then((respone)=>{
        console.log("1686240002 "+ respone)
        data = Res.Parse(respone);
    }).catch((e)=>{
        console.log("1686240018 "+ e)
        data = null;
    })
    console.log("1686239656 "+ data);
    
    return data;
}

export async function FindItemByIdUserPlayer(idUserPlayer: Types.ObjectId){
    var itemes;
    await ResModel.find({IdUserPlayer : idUserPlayer}).then((res : [])=>{
        itemes = res;
    })
    return itemes;
}

export async function UpdateRes(res:IRes) {
    ResModel.updateOne(res).then((res)=>{
        console.log("1685723759 "+res);
    })
}