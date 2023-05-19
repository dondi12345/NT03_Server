import mongoose, { Schema, Types } from 'mongoose';
import { Socket } from "socket.io";

export interface IUserSocket{
    idUser : Types.ObjectId;
    socket : Socket;
}

export class UserSocket implements IUserSocket{
    idUser : Types.ObjectId;
    socket : Socket;
}