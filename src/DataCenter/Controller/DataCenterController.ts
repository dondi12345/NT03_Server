import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { DataVersion } from "../Model/DataVersion";
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
