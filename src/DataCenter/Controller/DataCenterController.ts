import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { DataVersion } from "../Model/DataVersion";
import { dataVersionDictionary } from "../Service/DataCenterService";

class DataCenterController{
    Test(message : Message, res){
        res.send("Success")
        console.log("Dev 1689074788 Test")
    }
    
    CheckVersion(message : Message, res){
        var dataVersion = DataVersion.Parse(message.Data);
        if(dataVersionDictionary[dataVersion.Name].Version == dataVersion.Version){
            var messageCallback = new Message();
            messageCallback.MessageCode = MessageCode.DataCenter_VersionUpToDate;
            res.send(JSON.stringify(message));
            console.log("Up to date")
        }else{
            var messageCallback = new Message();
            messageCallback.MessageCode = MessageCode.DataCenter_VersionUpdate;
            message.Data = JSON.stringify(dataVersionDictionary[dataVersion.Name]);
            res.send(JSON.stringify(message));
            console.log("Update")
        }
    }
}

export default new DataCenterController()
