import { LogServer } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { LogType } from "../../LogServer/Model/LogModel";
import { DataVersion, DataVersionDictionary, GetDataVersionByName } from "../Model/DataVersion";

const dataNames = ["TestData", "MonsterData", "BulletData", "DamageEffectData"]

export let dataVersionDictionary : DataVersionDictionary;

export async function InitDataVersion(){
    dataVersionDictionary ={}
    for (let index = 0; index < dataNames.length; index++) {
        const element = dataNames[index];
        await GetDataVersionByName(element).then((res:DataVersion)=>{
            if(res != null && res != undefined){
                dataVersionDictionary[element] = res;
            }else{
                LogServer(LogCode.DataCenter_InitFail, "", LogType.Error);
            }
        }).catch(err=>{
            LogServer(LogCode.DataCenter_InitFail, err, LogType.Error);
        })
    }
    // GameData.forEach(element => {
    //     dataVersionDictionary[element.Name] = DataVersion.Parse(element);
    // });
    console.log("Dev 1689075214 InitDataVersion "+Object.keys(dataVersionDictionary).length)
}