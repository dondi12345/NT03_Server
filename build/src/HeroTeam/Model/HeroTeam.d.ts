import mongoose, { Types, Document } from "mongoose";
export declare class SelectHero {
    IdHero: string;
    IndexSlot: number;
    static Parse(data: any): SelectHero;
}
export declare class HeroTeam extends Document {
    IdUserPlayer: Types.ObjectId;
    Power: number;
    Slot1: string;
    Slot2: string;
    Slot3: string;
    Slot4: string;
    Slot5: string;
    static Parse(data: any): HeroTeam;
}
export declare const HeroTeamModel: mongoose.Model<HeroTeam, {}, {}, {}, mongoose.Document<unknown, {}, HeroTeam> & Omit<HeroTeam & {
    _id: Types.ObjectId;
}, never>, any>;
export declare function CreateHeroTeam(heroTeam: HeroTeam): Promise<any>;
export declare function FindHeroTeamByIdUserPlayer(idUserPlayer: Types.ObjectId): Promise<any>;
export declare function UpdateHeroTeam(heroTeam: HeroTeam): Promise<void>;
export declare function RemoveSlotHeroTeam(heroTeam: HeroTeam): Promise<void>;
export declare function TestHeroTeam(): Promise<void>;
