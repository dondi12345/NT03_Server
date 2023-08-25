import { Room, Client } from "colyseus";
import { Schema, MapSchema } from "@colyseus/schema";
export declare class PlayerGuessNumber extends Schema {
    answers: string;
    numb: number;
}
export declare class StateGuessNumber extends Schema {
    players: MapSchema<PlayerGuessNumber, string>;
    pass: string;
    something: string;
    inti(): void;
    createPlayer(sessionId: string): void;
    removePlayer(sessionId: string): void;
    playerAnswer(sessionId: string, answer?: string): void;
    Log(): void;
}
export declare class StateGuessNumberRoom extends Room<StateGuessNumber> {
    maxClients: number;
    onCreate(options: any): void;
    onJoin(client: Client): void;
    onLeave(client: any): void;
    onDispose(): void;
}
