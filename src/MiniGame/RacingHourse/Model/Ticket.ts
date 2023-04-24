import mongoose, { Schema, ObjectId } from 'mongoose';

export interface ITicket {
    _id : ObjectId;
    idUser : ObjectId;
    idResultRacingHourse : ObjectId;
    numberHourse : Number;
}

export class Ticket implements ITicket{
    _id : ObjectId;
    idUser : ObjectId;
    idResultRacingHourse : ObjectId;  
    numberHourse : Number;
}

const TicketSchema = new Schema<ITicket>(
    {
      _id : { type: mongoose.Schema.Types.ObjectId},
      idUser : { type: mongoose.Schema.Types.ObjectId},
      idResultRacingHourse : { type: mongoose.Schema.Types.ObjectId},
      numberHourse : {type: Number},
    }
);
  
export const TicketModel = mongoose.model<ITicket>('Ticket', TicketSchema);