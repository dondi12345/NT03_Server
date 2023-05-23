import mongoose, { Schema, Types } from "mongoose";
import { DefaultRes } from "./UserPlayerResCfg";

export interface IUserPlayerRes{
    IdUserPlayer : Types.ObjectId,

    //Resource
    diamond : number,
    money : number,
    food : number,
    gold : number,
    silver : number,
    enchanceStone : number,

    //Item
    heroScroll : number,
    blueprintHeroEquip_WhiteItem : number,
    blueprintHeroEquip_GreenItem : number,
    blueprintHeroEquip_BlueItem : number,
    blueprintHeroEquip_PurpleItem : number,
    blueprintHeroEquip_YellowItem : number,
    blueprintHeroEquip_RedItem : number,
}

export class UserPlayerRes implements IUserPlayerRes{
    IdUserPlayer : Types.ObjectId;

    //Resource
    diamond : number;
    money : number;
    food : number;
    gold : number;
    silver : number;
    enchanceStone : number;

    //Item
    heroScroll : number;
    blueprintHeroEquip_WhiteItem : number;
    blueprintHeroEquip_GreenItem : number;
    blueprintHeroEquip_BlueItem : number;
    blueprintHeroEquip_PurpleItem : number;
    blueprintHeroEquip_YellowItem : number;
    blueprintHeroEquip_RedItem : number;

    constructor() {
        
    }
}

const UserPlayerResSchema = new Schema<IUserPlayerRes>(
    {
        IdUserPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPlayer' },

        diamond : { type : Number, default : DefaultRes.diamond},
        money : { type : Number, default : DefaultRes.money},
        food : { type : Number, default : DefaultRes.food},
        gold : { type : Number, default : DefaultRes.gold},
        silver : { type : Number, default : DefaultRes.silver},
        enchanceStone : { type : Number, default : DefaultRes.enchanceStone},

        //Item
        heroScroll : { type : Number, default : DefaultRes.heroScroll},
        blueprintHeroEquip_WhiteItem : { type : Number, default : DefaultRes.blueprintHeroEquip_WhiteItem},
        blueprintHeroEquip_GreenItem : { type : Number, default : DefaultRes.blueprintHeroEquip_GreenItem},
        blueprintHeroEquip_BlueItem : { type : Number, default : DefaultRes.blueprintHeroEquip_BlueItem},
        blueprintHeroEquip_PurpleItem : { type : Number, default : DefaultRes.blueprintHeroEquip_PurpleItem},
        blueprintHeroEquip_YellowItem : { type : Number, default : DefaultRes.blueprintHeroEquip_YellowItem},
        blueprintHeroEquip_RedItem : { type : Number, default : DefaultRes.blueprintHeroEquip_RedItem},
    }
);
  
export const UserPlayerResModel = mongoose.model<IUserPlayerRes>('UserPlayerRes', UserPlayerResSchema);