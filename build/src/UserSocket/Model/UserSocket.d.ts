import { Types } from 'mongoose';
import { Socket } from "socket.io";
import { UserPlayer } from '../../UserPlayerServer/Model/UserPlayer';
import { Currency } from '../../Currency/Model/Currency';
import { HeroDictionary } from '../../HeroServer/Model/Hero';
import { HeroEquipDictionary } from '../../HeroEquip/Model/HeroEquip';
import { HeroTeam } from '../../HeroTeam/Model/HeroTeam';
import { PlatformCode } from '../../LogServer/Model/LogModel';
export interface IUserSocket {
    IdAccount: Types.ObjectId;
    IdUserPlayer: Types.ObjectId;
    Platform: PlatformCode;
    Socket: Socket;
    UserPlayer: UserPlayer;
    Hero: HeroDictionary;
    HeroEquip: HeroEquipDictionary;
    Currency: Currency;
    HeroTeam: HeroTeam;
}
export declare class UserSocket implements IUserSocket {
    IdAccount: Types.ObjectId;
    IdUserPlayer: Types.ObjectId;
    Platform: PlatformCode;
    Socket: Socket;
    UserPlayer: UserPlayer;
    Hero: HeroDictionary;
    HeroEquip: HeroEquipDictionary;
    Currency: Currency;
    HeroTeam: HeroTeam;
}
export type UserSocketServer = Record<string, Socket>;
export type UserSocketDictionary = Record<string, IUserSocket>;
