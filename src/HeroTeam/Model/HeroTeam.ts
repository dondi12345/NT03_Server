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
    Slot1 ?: Types.ObjectId;
    Slot2 ?: Types.ObjectId;
    Slot3 ?: Types.ObjectId;
    Slot4 ?: Types.ObjectId;
    Slot5 ?: Types.ObjectId;

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
        Slot1 : {type: mongoose.Schema.Types.ObjectId, ref: 'Hero'},
        Slot2 : {type: mongoose.Schema.Types.ObjectId, ref: 'Hero'},
        Slot3 : {type: mongoose.Schema.Types.ObjectId, ref: 'Hero'},
        Slot4 : {type: mongoose.Schema.Types.ObjectId, ref: 'Hero'},
        Slot5 : {type: mongoose.Schema.Types.ObjectId, ref: 'Hero'},
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

export async function TestHeroTeam() {
    HeroTeamModel.findById(new Types.ObjectId("64967143a76f2a6e578af8e4")).then((res) => {
        var data = HeroTeam.Parse(res);
        const heroTeam : HeroTeam = {
            Power : data.Power,
            IdUserPlayer : data.IdUserPlayer,

        }    
    })

}