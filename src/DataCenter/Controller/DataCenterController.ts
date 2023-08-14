import { RedisKeyConfig } from "../../Enviroment/Env";
import { DataHeroDictionary, HeroData } from "../../HeroServer/Model/Hero";
import { HeroCode } from "../../HeroServer/Model/HeroCode";
import { logController } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { redisControler } from "../../Service/Database/RedisConnect";
import { DataModel } from "../../Utils/DataModel";
import { enumUtils } from "../../Utils/EnumUtils";
import { DataVersion, DataVersionModel } from "../Model/DataVersion";
import { InitDataVersion, dataVersionDictionary } from "../Service/DataCenterService";

export function Test(message: Message, res) {
    res.send("Success")
    console.log("Dev 1689074788 Test")
}

export function CheckVersion(message: Message, res) {
    var dataVersion = DataVersion.Parse(message.Data);
    if (dataVersionDictionary[dataVersion.Name].Version == dataVersion.Version) {
        var messageCallback = new Message();
        messageCallback.MessageCode = MessageCode.DataCenter_VersionUpToDate;
        messageCallback.Data = JSON.stringify(dataVersion);
        res.send(JSON.stringify(messageCallback));
        console.log("Up to date")
    } else {
        var messageCallback = new Message();
        messageCallback.MessageCode = MessageCode.DataCenter_VersionUpdate;
        messageCallback.Data = JSON.stringify(dataVersionDictionary[dataVersion.Name]);
        res.send(JSON.stringify(messageCallback));
        console.log("Update")
    }
}

export function ReloadDataVersion(message: Message, res){
    InitDataVersion();
}

export const dataCenterName = {
    DataHero: "DataHero"
}

// ["DataMonster","DataBullet","DataDamageEffect","DataHeroEquip", "DataHero"]

class DataCenterController{
    constructor(){
        this.Init();
    }

    async Init(){
        await DataVersionModel.findOne({
            Name: dataCenterName.DataHero
        }).then(res=>{
            var dataVersion = DataModel.Parse<DataVersion>(res);
            if(dataVersion == null || dataVersion == undefined) throw null;
            redisControler.Set(RedisKeyConfig.KeyDataCenterDetail(dataCenterName.DataHero), JSON.stringify(dataVersion))
            dataVersion.Data.forEach(element => {
                var dataHero = DataModel.Parse<HeroData>(element);
                redisControler.Set(RedisKeyConfig.KeyDataCenterElement(dataCenterName.DataHero, dataHero.Code.toString()), JSON.stringify(dataHero))
            });
            logController.LogMessage(LogCode.Server_InitDataCenterSuc,"DataHero", "Server" )
        }).catch(err=>{
            logController.LogError(LogCode.DataCenter_InitFail, "DataHero: "+err, "Server")
        })
    }
}

export const dataCenterController = new DataCenterController();