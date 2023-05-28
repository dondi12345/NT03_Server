import mongoose, { Schema, Types } from 'mongoose';
import { Socket } from "socket.io";
import { UserPlayer } from '../../UserPlayerServer/Model/UserPlayer';
import { Res } from '../../ResServer/Model/Res';
import { Heroes } from '../../HeroServer/Model/Hero';

export interface IUserSocket{
    IdAccount : Types.ObjectId,
    IdUserPlayer : Types.ObjectId,
    Socket : Socket,
    UserPlayer : UserPlayer,
    Res : Res,
    Heroes : Heroes,

}

export class UserSocket implements IUserSocket{
    IdAccount : Types.ObjectId;
    IdUserPlayer : Types.ObjectId;
    Socket : Socket;
    UserPlayer : UserPlayer;
    Res : Res;
    Heroes : Heroes = {};
}

export type UserSocketServer = Record<string, Socket>;
export type UserSocketDictionary = Record<string, IUserSocket>;