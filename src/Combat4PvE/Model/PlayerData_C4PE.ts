export enum JobEnum {
    Warrior = 0,
    Mage = 1,
    Thief = 2,
}

export class PlayerData_C4PE {
    sessionId: string = "";
    playerID: string = "";
    playerName: string = "";
    playerIcon: number = 0;
    Job: number = 0;
    Lv : number = 1;
    STR: number = 0;
    VIT: number = 0;
    DEX: number = 0;
    MND: number = 0;
    SPI: number = 0;
    SPD: number = 0;
    HIT: number = 0;
    EVA: number = 0;
    CRI: number = 0;
    CRD: number = 0;
    VIS: number = 0;
    HP: number = 0;
    MP: number = 0;
}

export class PlayerDataJoin_C4PE {
    playerID: string;
    playerName: string;
    playerIcon: number = 0;
    Job: number = 0;
}