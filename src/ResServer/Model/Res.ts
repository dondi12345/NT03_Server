import mongoose, { Schema, Types } from "mongoose";
import { DefaultRes } from "./DefaultRes";
import { IResDetail } from "./ResDetail";

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
    HeroScroll : number,
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
    HeroScroll : number;
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

const ResSchema = new Schema<IRes>(
    {
        IdUserPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPlayer' },

        Diamond : { type : Number, default : DefaultRes.Diamond},
        Money : { type : Number, default : DefaultRes.Money},
        Food : { type : Number, default : DefaultRes.Food},
        Gold : { type : Number, default : DefaultRes.Gold},
        Silver : { type : Number, default : DefaultRes.Silver},
        EnchanceStone : { type : Number, default : DefaultRes.EnchanceStone},

        //Item
        HeroScroll : { type : Number, default : DefaultRes.heroScroll},
        BlueprintHeroEquip_WhiteItem : { type : Number, default : DefaultRes.BlueprintHeroEquip_WhiteItem},
        BlueprintHeroEquip_GreenItem : { type : Number, default : DefaultRes.BlueprintHeroEquip_GreenItem},
        BlueprintHeroEquip_BlueItem : { type : Number, default : DefaultRes.BlueprintHeroEquip_BlueItem},
        BlueprintHeroEquip_PurpleItem : { type : Number, default : DefaultRes.BlueprintHeroEquip_PurpleItem},
        BlueprintHeroEquip_YellowItem : { type : Number, default : DefaultRes.BlueprintHeroEquip_YellowItem},
        BlueprintHeroEquip_RedItem : { type : Number, default : DefaultRes.BlueprintHeroEquip_RedItem},
    }
);
  
export const ResModel = mongoose.model<IRes>('Res', ResSchema);

export async function CreateUserPlayerRes(data : IRes){
    var userPlayerRes;
    await ResModel.create(data).then((res)=>{
        console.log("1684837676 "+ res)
        userPlayerRes = Res.Parse(res);
    }).catch((e)=>{
        console.log("1684837715 "+ e)
    })
    return userPlayerRes;
}

export async function FindResByIdUserPlayer(idUserPlayer: Types.ObjectId) {
    var userPlayerRes;
    await ResModel.findOne({IdUserPlayer : idUserPlayer}).then((res)=>{
        userPlayerRes = Res.Parse(res);
    })
    return userPlayerRes;
}

export async function UpdateRes(lsitResDetail : IResDetail[], idUserPlayer : Types.ObjectId){
    var query = {};
    await lsitResDetail.forEach(element => {
        query[`${element.Name}`] = element.Number;
    });
    console.log("1685289158 "+JSON.stringify(query));
    ResModel.updateOne({IdUserPlayer : idUserPlayer}, {$set:query}).then(res=>{
        console.log("1684851978 " + JSON.stringify(res))
    })
}