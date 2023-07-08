import mongoose, { Schema, Types } from "mongoose";
import { ResCode } from "./ResCode";
import { QualityItemCode } from "../../QualityItem/QualityItem";
import { ResType } from "./ResType";
import { LogIdUserPlayer } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";

export class Reses{
    Elements : IRes[] = [];
}

export type ResDataDictionary = Record<string, ResData>;

export class ResData{
    Code : ResCode;
    Type : ResType;
    QualityItemCode : QualityItemCode;
    Price : number;
    CanSell : boolean;
    IconName : string;
    IconBorderName : string;
    CraftHeroEquip : number;

    static Parse(data) : ResData{
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
    Code : ResCode,
    IdUserPlayer : Types.ObjectId,
    Number : number,
}

export class Res implements IRes{
    _id : Types.ObjectId;
    Code : ResCode;
    IdUserPlayer : Types.ObjectId;
    Number : number;

    constructor(resCode: ResCode, idUserPlayer : Types.ObjectId, number : number){
        this.Code= resCode;
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
        Code : { type : Number, enum : ResCode},
        IdUserPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPlayer' },
        Number : { type : Number, default : 0},
    }
);

export const ResModel = mongoose.model<IRes>('Res', ResSchema);

export async function CreateRes(res : IRes){
    var data;
    await ResModel.create(res).then((respone)=>{
        console.log("Dev 1686240002 "+ respone)
        data = Res.Parse(respone);
    }).catch((e)=>{
        console.log("Dev 1686240018 "+ e)
        data = null;
    })
    console.log("Dev 1686239656 "+ data);
    
    return data;
}

export async function FindResByIdUserPlayer(idUserPlayer: Types.ObjectId){
    var itemes;
    await ResModel.find({IdUserPlayer : idUserPlayer}).then((res : [])=>{
        itemes = res;
    })
    return itemes;
}

export async function FindItemByIdUserPlayerAndCode(idUserPlayer: Types.ObjectId, code : ResCode) {
    var item;
    await ResModel.findOne({IdUserPlayer : idUserPlayer, Code : code}).then((res)=>{
        item = res;
    })
    return item;
}

export async function UpdateRes(res:IRes) {
    console.log("Dev 1685723760 " + res);
    ResModel.updateOne({
        _id : res._id
    },{
        Number : res.Number,
    }).then((res)=>{
        console.log("Dev 1685723759 "+res);
    }).catch(e=>{
        LogIdUserPlayer(LogCode.Res_SaveFail, res.IdUserPlayer.toHexString(), e);
    })
}