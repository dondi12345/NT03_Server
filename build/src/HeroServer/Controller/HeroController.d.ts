import { Message } from "../../MessageServer/Model/Message";
import { Hero, HeroGear } from "../Model/Hero";
import { TransferData } from '../../TransferData';
declare class HeroController {
    Login(message: Message, transferData: TransferData): Promise<void>;
    Summon(message: Message, transferData: TransferData): Promise<void>;
    GetSummonResult(message: Message, transferData: TransferData): Promise<void>;
    HireHero(message: Message, transferData: TransferData): Promise<void>;
    UpgradeLv(message: Message, transferData: TransferData): Promise<void>;
    UpdateGear(heroID: any, heroGear: HeroGear): Promise<any>;
    GetHeroCached(userPlayerID: string, heroID: string): Promise<Hero | null>;
    SetHeroCached(hero: Hero): Promise<void>;
}
export declare const heroController: HeroController;
export {};
