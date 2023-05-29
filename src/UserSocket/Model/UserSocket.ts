import mongoose, { Schema, Types } from 'mongoose';
import { Socket } from "socket.io";
import { UserPlayer } from '../../UserPlayerServer/Model/UserPlayer';
import { Res } from '../../ResServer/Model/Res';
import { HeroDictionary } from '../../HeroServer/Model/Hero';

export interface IUserSocket{
    IdAccount : Types.ObjectId,
    IdUserPlayer : Types.ObjectId,
    Socket : Socket,
    UserPlayer : UserPlayer,
    Res : Res,
    HeroDictionary : HeroDictionary,

}

export class UserSocket implements IUserSocket{
    IdAccount : Types.ObjectId;
    IdUserPlayer : Types.ObjectId;
    Socket : Socket;
    UserPlayer : UserPlayer;
    Res : Res;
    HeroDictionary : HeroDictionary;
}

export type UserSocketServer = Record<string, Socket>;
export type UserSocketDictionary = Record<string, IUserSocket>;