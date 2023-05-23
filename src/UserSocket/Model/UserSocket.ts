import mongoose, { Schema, Types } from 'mongoose';
import { Socket } from "socket.io";
import { UserPlayer } from '../../UserPlayerServer/Model/UserPlayer';
import { UserPlayerRes } from '../../ResServer/Model/UserPlayerRes';

export interface IUserSocket{
    IdAccount : Types.ObjectId,
    IdUserPlayer : Types.ObjectId,
    Socket : Socket,
    UserPlayer : UserPlayer,
    UserPlayerRes : UserPlayerRes,
}

export class UserSocket implements IUserSocket{
    IdAccount : Types.ObjectId;
    IdUserPlayer : Types.ObjectId;
    Socket : Socket;
    UserPlayer : UserPlayer;
    UserPlayerRes : UserPlayerRes;
}

export type UserSocketServer = Record<string, Socket>;
export type UserSocketDictionary = Record<string, IUserSocket>;