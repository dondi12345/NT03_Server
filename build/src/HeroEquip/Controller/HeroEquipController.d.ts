import { Message } from "../../MessageServer/Model/Message";
import { HeroEquip } from "../Model/HeroEquip";
import { TransferData } from "../../TransferData";
declare class HeroEquipController {
    Login(message: Message, transferData: TransferData): Promise<Message | undefined>;
    CraftEquip(message: Message, transferData: TransferData): Promise<Message | undefined>;
    UpgradeLv(message: Message, transferData: TransferData): Promise<Message | undefined>;
    WearingEquip(message: Message, transferData: TransferData): Promise<Message | undefined>;
    UnWearingEquip(message: Message, transferData: TransferData): Promise<Message | undefined>;
    GetHeroEquipCached(userPlayerID: string, heroEquipID: string): Promise<HeroEquip | null>;
    SetHeroEquipCached(heroEquip: HeroEquip): Promise<void>;
}
export declare const heroEquipController: HeroEquipController;
export {};
