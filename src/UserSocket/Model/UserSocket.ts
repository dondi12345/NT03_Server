import mongoose, { Schema, Types } from 'mongoose';
import { Socket } from "socket.io";
import { UserPlayer } from '../../UserPlayerServer/Model/UserPlayer';

export interface IUserSocket{
    IdUserPlayer : Types.ObjectId;
    Socket : Socket;
    UserPlayer : UserPlayer;
}

export class UserSocket implements IUserSocket{
    IdUserPlayer : Types.ObjectId;
    Socket : Socket;
    UserPlayer : UserPlayer;
}

export type UserSocketServer = Record<string, Socket>;
export type UserSocketDictionary = Record<string, IUserSocket>;