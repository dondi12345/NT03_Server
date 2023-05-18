import mongoose, { Schema, Types } from 'mongoose';
import { Socket } from "socket.io";

export interface IUserSocker{
    idUser : Types.ObjectId;
    socket : Socket;
}

export class UserSocker implements IUserSocker{
    idUser : Types.ObjectId;
    socket : Socket;
}