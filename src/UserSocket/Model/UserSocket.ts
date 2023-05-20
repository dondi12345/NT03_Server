import mongoose, { Schema, Types } from 'mongoose';
import { Socket } from "socket.io";

export interface IUserSocket{
    IdUserPlayer : Types.ObjectId;
    socket : Socket;
}

export class UserSocket implements IUserSocket{
    IdUserPlayer : Types.ObjectId;
    socket : Socket;
}

export type UserSocketServer = Record<string, Socket>;