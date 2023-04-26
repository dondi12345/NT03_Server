import mongoose, { Schema, ObjectId } from 'mongoose';

export interface ITicket {
    _id : ObjectId;
    idUser : ObjectId;
    idResultRacingHourse : ObjectId;
    numberHourse : Number;
    rank : Number;
}

export class Ticket implements ITicket{
    _id : ObjectId;
    idUser : ObjectId;
    idResultRacingHourse : ObjectId;  
    numberHourse : Number;
    rank : Number = 0;
}

const TicketSchema = new Schema<ITicket>(
    {
      _id : { type: mongoose.Schema.Types.ObjectId},
      idUser : { type: mongoose.Schema.Types.ObjectId},
      idResultRacingHourse : { type: mongoose.Schema.Types.ObjectId},
      numberHourse : {type: Number},
      rank : {type: Number, default : 0},
    }
);
  
export const TicketModel = mongoose.model<ITicket>('Ticket', TicketSchema);

export async function GetTicketByIdResultRacingHourse(idRacingHourse : ObjectId){
    var data;
    console.log(idRacingHourse);
    await TicketModel.find({},{idResultRacingHourse : new mongoose.Types.ObjectId("64464d995f152f402a21521d")}).then(res=>{
        console.log(res)
        data = res;
    })
    return data;
}