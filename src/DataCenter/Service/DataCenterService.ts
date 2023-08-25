import { RedisKeyConfig } from "../../Enviroment/Env";
import { HeroData } from "../../HeroServer/Model/Hero";
import { logController } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { redisControler } from "../../Service/Database/RedisConnect";
import { DataModel } from "../../Utils/DataModel";
import { dataCenterController } from "../Controller/DataCenterController";
import { DataVersion, DataVersionModel, dataCenterName } from "../Model/DataVersion";

class DataCenterService{
    constructor(){
        // this.Init();
    }

    async Init(){
        this.InitData(dataCenterName.DataHero);
        this.InitData(dataCenterName.DataMonster);
        this.InitData(dataCenterName.DataBullet);
        this.InitData(dataCenterName.DataDamageEffect);
        this.InitData(dataCenterName.DataHeroEquip);
        this.InitData(dataCenterName.DataItem);
    }

    async InitData(dataName : string){
        var suc
        await DataVersionModel.findOne({
            Name: dataName
        }).then(res=>{
            var dataVersion = DataModel.Parse<DataVersion>(res);
            if(dataVersion == null || dataVersion == undefined) throw null;
            redisControler.Set(RedisKeyConfig.KeyDataCenterDetail(dataName), JSON.stringify(dataVersion))
            dataVersion.Data.forEach(element => {
                dataCenterController.SetDataElementCached(dataName, element.Code.toString(), JSON.stringify(element));
            });
            logController.LogMessage(LogCode.Server_InitDataCenterSuc,dataName, "Server" )
            suc = true;
            return suc;
        }).catch(err=>{
            logController.LogError(LogCode.DataCenter_InitFail, dataName+": "+err, "Server")
            suc = false;
            return suc;
        })
        return suc
    }
    
}

export const dataCenterService = new DataCenterService();