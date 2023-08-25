import { EffectCode } from "../Model/EffectCode";
import { RacingHourseData } from "../Model/RacingHourseData";
export declare function RacingHourseManager(): void;
export declare function CreateRacingHourse(): Promise<void>;
export declare function RacingHourse(): void;
export declare function InitListRacingHourseData(): RacingHourseData[];
export declare function InitRacingHourseData(): RacingHourseData;
export declare function TotalRate(): number;
export declare function GetEffectByRate(rate: number): Effect;
export declare class Effect {
    appearRate: number;
    effectCode: EffectCode;
    timeOver: number;
    countEffect: number;
}
export declare let effectModelCollections: Effect[];
