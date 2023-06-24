import mongoose, { Schema, Types } from "mongoose";
import { LogIdUserPlayer } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";

export class SelectHero{
    IdHero : string
    IndexSlot : number;

    static Parse(data) : SelectHero{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}

export class HeroTeam{
    IdUserPlayer : Types.ObjectId;
    Power : number
    Slot1 : string;
    Slot2 : string;
    Slot3 : string;
    Slot4 : string;
    Slot5 : string;

    static Parse(data) : HeroTeam{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }
}

const HeroTeamSchema = new Schema<HeroTeam>(
    {
        IdUserPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPlayer' },
        Power : {type: Number, default : 0},
        Slot1 : {type: String},
        Slot2 : {type: String},
        Slot3 : {type: String},
        Slot4 : {type: String},
        Slot5 : {type: String},
    }
);

export const HeroTeamModel = mongoose.model<HeroTeam>('HeroTeam', HeroTeamSchema);

export async function CreateHeroTeam(heroTeam : HeroTeam){
    var data;
    await HeroTeamModel.create(heroTeam).then((res)=>{
        console.log("Dev 1685285708 "+ res)
        data = HeroTeam.Parse(res);
    }).catch((e)=>{
        console.log("Dev 1685285716 "+ e)
        data = null;
    })
    return data;
}

export async function FindHeroTeamByIdUserPlayer(idUserPlayer: Types.ObjectId) {
    var data;
    await HeroTeamModel.findOne({IdUserPlayer : idUserPlayer}).then((res)=>{
        data = HeroTeam.Parse(res);
    })
    return data;
}

export async function UpdateHeroTeam(heroTeam : HeroTeam) {
    HeroTeamModel.updateOne({IdUserPlayer : heroTeam.IdUserPlayer},{
        Power: heroTeam.Power,
        Slot1 : heroTeam.Slot1,
        Slot2 : heroTeam.Slot2,
        Slot3 : heroTeam.Slot3,
        Slot4 : heroTeam.Slot4,
        Slot5 : heroTeam.Slot5,
    }).then(res=>{
        console.log("Dev 1687617538 ", res);
    }).catch((e)=>{
        LogIdUserPlayer(LogCode.HeroTeam_SaveFail, heroTeam.IdUserPlayer.toString(), e);
    })
}