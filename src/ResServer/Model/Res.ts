import mongoose, { Schema, Types } from "mongoose";
import { DefaultRes } from "./DefaultRes";

export interface IRes{
    IdUserPlayer : Types.ObjectId,

    //Resource
    Diamond : number,
    Money : number,
    Food : number,
    Gold : number,
    Silver : number,
    EnchanceStone : number,

    //Item
    heroScroll : number,
    BlueprintHeroEquip_WhiteItem : number,
    BlueprintHeroEquip_GreenItem : number,
    BlueprintHeroEquip_BlueItem : number,
    BlueprintHeroEquip_PurpleItem : number,
    BlueprintHeroEquip_YellowItem : number,
    BlueprintHeroEquip_RedItem : number,
}

export class Res implements IRes{
    IdUserPlayer : Types.ObjectId;

    //Resource
    Diamond : number;
    Money : number;
    Food : number;
    Gold : number;
    Silver : number;
    EnchanceStone : number;

    //Item
    heroScroll : number;
    BlueprintHeroEquip_WhiteItem : number;
    BlueprintHeroEquip_GreenItem : number;
    BlueprintHeroEquip_BlueItem : number;
    BlueprintHeroEquip_PurpleItem : number;
    BlueprintHeroEquip_YellowItem : number;
    BlueprintHeroEquip_RedItem : number;

    constructor() {
        
    }

    static Parse(data) : IRes{
        try{
            data = JSON.parse(data);
        }catch(err){}
        return data;
    }
}

const UserPlayerResSchema = new Schema<IRes>(
    {
        IdUserPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPlayer' },

        Diamond : { type : Number, default : DefaultRes.Diamond},
        Money : { type : Number, default : DefaultRes.Money},
        Food : { type : Number, default : DefaultRes.Food},
        Gold : { type : Number, default : DefaultRes.Gold},
        Silver : { type : Number, default : DefaultRes.Silver},
        EnchanceStone : { type : Number, default : DefaultRes.EnchanceStone},

        //Item
        heroScroll : { type : Number, default : DefaultRes.heroScroll},
        BlueprintHeroEquip_WhiteItem : { type : Number, default : DefaultRes.BlueprintHeroEquip_WhiteItem},
        BlueprintHeroEquip_GreenItem : { type : Number, default : DefaultRes.BlueprintHeroEquip_GreenItem},
        BlueprintHeroEquip_BlueItem : { type : Number, default : DefaultRes.BlueprintHeroEquip_BlueItem},
        BlueprintHeroEquip_PurpleItem : { type : Number, default : DefaultRes.BlueprintHeroEquip_PurpleItem},
        BlueprintHeroEquip_YellowItem : { type : Number, default : DefaultRes.BlueprintHeroEquip_YellowItem},
        BlueprintHeroEquip_RedItem : { type : Number, default : DefaultRes.BlueprintHeroEquip_RedItem},
    }
);
  
export const UserPlayerResModel = mongoose.model<IRes>('UserPlayerRes', UserPlayerResSchema);

export async function CreateUserPlayerRes(data : IRes){
    var userPlayerRes;
    await UserPlayerResModel.create(data).then((res)=>{
        userPlayerRes = Res.Parse(res);
    })
    return userPlayerRes;
}

export async function FindUserPlayerResByIdUserPlayer(idUserPlayer: Types.ObjectId) {
    var userPlayerRes;
    await UserPlayerResModel.find({IdUserPlayer : idUserPlayer}).then((res)=>{
        userPlayerRes = Res.Parse(res);
    })
    return userPlayerRes;
}