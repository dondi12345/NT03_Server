import { LogServer } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { DataVersion, DataVersionDictionary, GetDataVersionByName } from "../Model/DataVersion";
import { GameData } from "../Model/GameData";

const dataNames = ["TestData", "MonsterData", "BulletData", "DamageEffectData"]

export let dataVersionDictionary : DataVersionDictionary;

export async function InitDataVersion(){
    dataVersionDictionary ={}
    for (let index = 0; index < dataNames.length; index++) {
        const element = dataNames[index];
        await GetDataVersionByName(element, (error, response)=>{
            if(error){
                LogServer(LogCode.DataCenter_InitFail, error)
            }else{
                dataVersionDictionary[element] = response;
            }
        })
    }
    // GameData.forEach(element => {
    //     dataVersionDictionary[element.Name] = DataVersion.Parse(element);
    // });
    console.log("Dev 1689075214 InitDataVersion "+Object.keys(dataVersionDictionary).length)
}