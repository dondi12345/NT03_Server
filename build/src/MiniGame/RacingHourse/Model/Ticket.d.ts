import mongoose, { Types } from 'mongoose';
import { IResultRacingHourse } from './ResultRacingHourse';
export interface ITicket {
    _id: Types.ObjectId;
    IdUserPlayer: Types.ObjectId;
    IdResultRacingHourse: Types.ObjectId;
    NumberHourse: Number;
    Rank: Number;
    ReceiveGift: Boolean;
}
export declare class Ticket implements ITicket {
    _id: Types.ObjectId;
    IdUserPlayer: Types.ObjectId;
    IdResultRacingHourse: Types.ObjectId;
    NumberHourse: Number;
    Rank: Number;
    ReceiveGift: Boolean;
}
export declare const TicketModel: mongoose.Model<ITicket, {}, {}, {}, mongoose.Document<unknown, {}, ITicket> & Omit<ITicket & Required<{
    _id: Types.ObjectId;
}>, never>, any>;
export declare function CreateTicket(data: ITicket): Promise<void>;
export declare function GetTicketByIdResultRacingHourse(idRacingHourse: Types.ObjectId): Promise<any>;
export declare function GetTicketById(_id: Types.ObjectId): Promise<any>;
export declare function GetTicketAndResultById(_id: Types.ObjectId): Promise<any>;
export declare function UpdateRankOfTicket(resultRacingHourse: IResultRacingHourse): Promise<void>;
export declare function UpdateTicket(ticket: Ticket): Promise<void>;
