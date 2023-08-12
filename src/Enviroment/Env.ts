export const portConfig = {
    portAPI : 3000,
    portAPIServer : 3001,
    portMessageServer : 3002,
    portChatServer : 3003,
    portAccountServer : 3004,
    portDailyLoginReward : 3005,
    portWebServer : 3006,
}

export const Mongo = {
    // dbLink : "mongodb://45.124.95.182:27017",
    // dbLink : "mongodb+srv://dondi1412:Trunghung24@cluster0.vj24px5.mongodb.net/",
    // dbLink : "mongodb://localhost:27017",
    dbLink : "mongodb://nt03:Trunghung24@103.116.9.104:27017/?authMechanism=DEFAULT",
    DbName : "NT03",
}

export const variable = {
    eventSocketConnection : "connection",
    eventSocketListening : "listening",
    eventSocketDisconnect : "disconnect",
    worker : "worker",
    messageServer : "MessageServer",
    chatServer: "ChatServer",
    chatSystem : "ChatSystem",
    idChatGlobal : "643e14f2d8930cecd1865a60",
    maxLengthChat : 50,
    maxLandRacingHourse : 8,
    maxStepRacingHourse : 20,
    localhost : "localhost",
    // localhost : "45.124.95.182",
}

export const SocketConfig = {
    Listening : "listening",
}

export const RedisConfig = {
    Host : "103.116.9.104",
    Port : "6379",
    Password : "Trunghung24",

    MessagePubSub : "MessagePubSub",

    AccountChannel : "AccountChannel",
    UserPlayerChannel : "UserPlayerChannel",

    KeyUserPlayerSession : "NT03:UserPlayer:Session:",
}
class RedisKey{
    NameProject = "NT03";

    KeyHeroSummon(userID){
        return this.NameProject +":UserPlayer:"+userID+":HeroSummon";
    }

    KeyUserPlayerSession(userID){
        return this.NameProject+":UserPlayer:"+userID+":Session"
    }
    KeyUserPlayerData(userID){
        return this.NameProject+":UserPlayer:"+userID+":Data"
    }
    KeyCurrencyData(userID){
        return this.NameProject+":UserPlayer:"+userID+":Currency"
    }
    KeyHeroData(userID, heroID){
        return this.NameProject+":UserPlayer:"+userID+":Hero:"+heroID
    }
}
export const RedisKeyConfig = new RedisKey();