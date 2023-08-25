export declare const portConfig: {
    portAPI: number;
    portAPIServer: number;
    portMessageServer: number;
    portChatServer: number;
    portAccountServer: number;
    portDailyLoginReward: number;
    portWebServer: number;
    portGuessNumber: number;
};
export declare const Mongo: {
    dbLink: string;
    DbName: string;
};
export declare const variable: {
    eventSocketConnection: string;
    eventSocketListening: string;
    eventSocketDisconnect: string;
    worker: string;
    messageServer: string;
    chatServer: string;
    chatSystem: string;
    idChatGlobal: string;
    maxLengthChat: number;
    maxLandRacingHourse: number;
    maxStepRacingHourse: number;
    localhost: string;
};
export declare const SocketConfig: {
    Listening: string;
};
export declare const RedisConfig: {
    Host: string;
    Port: string;
    Password: string;
    MessagePubSub: string;
    AccountChannel: string;
    UserPlayerChannel: string;
    KeyUserPlayerSession: string;
};
declare class RedisKey {
    NameProject: string;
    KeyDataCenterDetail(dataName: string): string;
    KeyDataCenterElement(dataName: string, index: string): string;
    KeyHeroSummon(userID: any): string;
    KeyUserPlayerSession(userID: any): string;
    KeyUserPlayerData(userID: any): string;
    KeyCurrencyData(userID: any): string;
    KeyHeroTeamData(userID: any): string;
    KeyHeroData(userID: any, heroID: any): string;
    KeyHeroEquipData(userID: any, heroEquipID: any): string;
}
export declare const RedisKeyConfig: RedisKey;
export {};
