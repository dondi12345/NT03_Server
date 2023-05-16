import mongoose, { Schema, Types } from 'mongoose';
import { IResultRacingHourse, ResultRacingHourse, ResultRacingHourseModel } from './ResultRacingHourse';

export interface ITicket {
    _id : Types.ObjectId;
    idUser : Types.ObjectId;
    idResultRacingHourse : Types.ObjectId;
    numberHourse : Number;
    rank : Number;
    receiveGift : Boolean;
}

export class Ticket implements ITicket{
    _id : Types.ObjectId;
    idUser : Types.ObjectId;
    idResultRacingHourse : Types.ObjectId;  
    numberHourse : Number;
    rank : Number = 0;
    receiveGift : Boolean = false;
}

const TicketSchema = new Schema<ITicket>(
    {
      _id : { type: Schema.Types.ObjectId, default: new Types.ObjectId()},
      idUser : { type: Schema.Types.ObjectId, ref : 'UserPlayer'},
      idResultRacingHourse : { type: Schema.Types.ObjectId, ref: 'ResultRacingHourse'},
      numberHourse : {type: Number},
      rank : {type: Number, default : 0},
      receiveGift : {type: Boolean, default: false},
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
    await TicketModel.find({},{idResultRacingHourse : idRacingHourse}).then(res=>{
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
    TicketModel.find({idResultRacingHourse : resultRacingHourse._id}).then(res=>{
        res.forEach(element => {
            if(resultRacingHourse.racingHourseDatas != undefined && resultRacingHourse.racingHourseDatas != null && resultRacingHourse.racingHourseDatas.length > 0){
                var index : number = element.numberHourse.valueOf();
                element.rank = resultRacingHourse.racingHourseDatas[index].rank;
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