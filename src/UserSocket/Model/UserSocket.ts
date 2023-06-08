import mongoose, { Schema, Types } from 'mongoose';
import { Socket } from "socket.io";
import { UserPlayer } from '../../UserPlayerServer/Model/UserPlayer';
import { Currency } from '../../Currency/Model/Currency';
import { HeroDictionary } from '../../HeroServer/Model/Hero';
import { HeroEquipDictionary } from '../../HeroEquip/Model/HeroEquip';
import { ResDictionary } from '../../Res/Model/Res';

export interface IUserSocket{
    IdAccount : Types.ObjectId,
    IdUserPlayer : Types.ObjectId,
    Socket : Socket,
    UserPlayer : UserPlayer,
    Currency : Currency,
    HeroDictionary : HeroDictionary,
    HeroEquipDictionary : HeroEquipDictionary,
    ResDictionary : ResDictionary,
}

export class UserSocket implements IUserSocket{
    IdAccount : Types.ObjectId;
    IdUserPlayer : Types.ObjectId;
    Socket : Socket;
    UserPlayer : UserPlayer;
    Currency : Currency;
    HeroDictionary : HeroDictionary;
    HeroEquipDictionary : HeroEquipDictionary;
    ResDictionary : ResDictionary;
}

export type UserSocketServer = Record<string, Socket>;
export type UserSocketDictionary = Record<string, IUserSocket>;