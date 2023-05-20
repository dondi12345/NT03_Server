import mongoose, { Schema, Types } from 'mongoose';
import { IResultRacingHourse, ResultRacingHourse, ResultRacingHourseModel } from './ResultRacingHourse';

export interface ITicket {
    _id : Types.ObjectId;
    IdUserPlayer : Types.ObjectId;
    IdResultRacingHourse : Types.ObjectId;
    NumberHourse : Number;
    Rank : Number;
    ReceiveGift : Boolean;
}

export class Ticket implements ITicket{
    _id : Types.ObjectId;
    IdUserPlayer : Types.ObjectId;
    IdResultRacingHourse : Types.ObjectId;  
    NumberHourse : Number;
    Rank : Number = 0;
    ReceiveGift : Boolean = false;
}

const TicketSchema = new Schema<ITicket>(
    {
      _id : { type: Schema.Types.ObjectId, default: new Types.ObjectId()},
      IdUserPlayer : { type: Schema.Types.ObjectId, ref : 'UserPlayer'},
      IdResultRacingHourse : { type: Schema.Types.ObjectId, ref: 'ResultRacingHourse'},
      NumberHourse : {type: Number},
      Rank : {type: Number, default : 0},
      ReceiveGift : {type: Boolean, default: false},
    }
);
  
export const TicketModel = mongoose.model<ITicket>('Ticket', TicketSchema);

export async function CreateTicket(data : ITicket){
    TicketModel.create(data).then(res=>{
        console.log(res);
    }).catch(err=>{
        console.log(err);
    })
}

export async function GetTicketByIdResultRacingHourse(idRacingHourse : Types.ObjectId){
    var data;
    console.log(idRacingHourse);
    await TicketModel.find({},{IdResultRacingHourse : idRacingHourse}).then(res=>{
        console.log(res)
        data = res;
    })
    return data;
}

export async function GetTicketById(_id : Types.ObjectId){
    ResultRacingHourseModel;
    var data;
    await TicketModel.findById(_id).then(res=>{
        data = res;
    });
    console.log(data);
    return data;
}

export async function GetTicketAndResultById(_id : Types.ObjectId) {
    ResultRacingHourseModel;
    var data;
    await TicketModel.findById(_id).populate('idResultRacingHourse').orFail().then(res=>{
        data = res;
    });
    console.log(data);
    return data;
}

export async function UpdateRankOfTicket(resultRacingHourse : IResultRacingHourse) {
    TicketModel.find({IdResultRacingHourse : resultRacingHourse._id}).then(res=>{
        res.forEach(element => {
            if(resultRacingHourse.racingHourseDatas != undefined && resultRacingHourse.racingHourseDatas != null && resultRacingHourse.racingHourseDatas.length > 0){
                var index : number = element.NumberHourse.valueOf();
                element.Rank = resultRacingHourse.racingHourseDatas[index].Rank;
            }
            UpdateTicket(element);
        });
    })
}

export async function UpdateTicket(ticket : Ticket) {
    console.log("Update Ticket")
    TicketModel.findByIdAndUpdate(ticket._id,ticket).then(res =>{
        console.log(res);
    }).catch(err=>{
        console.log(err);
    })
}