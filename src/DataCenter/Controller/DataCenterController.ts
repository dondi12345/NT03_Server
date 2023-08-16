import { RedisKeyConfig } from "../../Enviroment/Env";
import { logController } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { redisControler } from "../../Service/Database/RedisConnect";
import { TransferData } from "../../TransferData";
import { DataModel } from "../../Utils/DataModel";
import { DataVersion } from "../Model/DataVersion";
import { dataCenterService } from "../Service/DataCenterService";

class DataCenterController{
    async CheckVersion(message: Message, transferData : TransferData) {
        var dataVersion = DataModel.Parse<DataVersion>(message.Data);
        var dataDetail = DataModel.Parse<DataVersion>(await redisControler.Get(RedisKeyConfig.KeyDataCenterDetail(dataVersion.Name)));
        if(dataDetail == null || dataDetail == undefined){
            logController.LogError(LogCode.DataCenter_NotFoundInCache, dataVersion.Name, "Server");
            var messageCallback = new Message();
            messageCallback.MessageCode = MessageCode.DataCenter_FailUpdate;
            messageCallback.Data = JSON.stringify(dataVersion)
            transferData.Send(JSON.stringify(messageCallback))
            return;
        }
        if(dataDetail.Version == dataVersion.Version){
            var messageCallback = new Message();
            messageCallback.MessageCode = MessageCode.DataCenter_VersionUpToDate;
            messageCallback.Data = JSON.stringify(dataVersion);
            transferData.Send(JSON.stringify(messageCallback));
            logController.LogDev("1692076265 Up to date")
        } else {
            var messageCallback = new Message();
            messageCallback.MessageCode = MessageCode.DataCenter_VersionUpdate;
            messageCallback.Data = JSON.stringify(dataDetail);
            transferData.Send(JSON.stringify(messageCallback));
            logController.LogDev("1692076266 Update")
        }
    }

    async ReloadData(message: Message, transferData : TransferData){
        var dataVersion = DataModel.Parse<DataVersion>(message.Data);
        var suc = await dataCenterService.InitData(dataVersion.Name);
        var messageCallback = new Message();
        if(suc) messageCallback.MessageCode = MessageCode.DataCenter_UpdateVersionSuc
        else messageCallback.MessageCode = MessageCode.DataCenter_UpdateVersionFail
        transferData.Send(JSON.stringify(messageCallback))
    }

    async GetDataElementCached(dataName: string, code : string) {
        var dataJson = await new Promise(async (reslove, rejects) => {
            reslove(await redisControler.Get(RedisKeyConfig.KeyDataCenterElement(dataName, code)))
        })
        if (dataJson == null || dataJson == undefined) {
            logController.LogError(LogCode.DataCenter_NotFoundInCache, dataName, "Server")
            return null;
        }
        return dataJson
    }

    async SetDataElementCached(dataName: string, code : string, data : any) {
        redisControler.Set(RedisKeyConfig.KeyDataCenterElement(dataName, code), JSON.stringify(data));
    }
}

export const dataCenterController = new DataCenterController();