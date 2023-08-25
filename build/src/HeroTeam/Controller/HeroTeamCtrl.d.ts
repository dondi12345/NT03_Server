import { Message } from "../../MessageServer/Model/Message";
import { HeroTeam } from "../Model/HeroTeam";
import { TransferData } from "../../TransferData";
declare class HeroTeamCtrl {
    Login(message: Message, transferData: TransferData): Promise<Message | undefined>;
    SelectHero(message: Message, transferData: TransferData): Promise<Message | undefined>;
    DeselectHero(message: Message, transferData: TransferData): Promise<Message | undefined>;
    GetHeroTeamCached(userPlayerID: string): Promise<HeroTeam>;
    SetHeroTeamCached(heroTeam: HeroTeam): Promise<void>;
}
export declare const heroTeamCtrl: HeroTeamCtrl;
export {};
