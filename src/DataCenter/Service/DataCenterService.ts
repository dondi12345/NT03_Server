import { LogServer } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { DataVersion, DataVersionDictionary } from "../Model/DataVersion";
import { GameData } from "../Model/GameData";

const dataNames = ["TestData"]

// export let dataVersionDictionary : DataVersionDictionary;

export function InitDataVersion(){
    // dataVersionDictionary ={}
    // dataNames.forEach(element => {
    //     GetDataVersionByName(element, (error, response)=>{
    //         if(error){
    //             LogServer(LogCode.DataCenter_InitFail, error)
    //         }else{
    //             count ++;
    //             dataVersionDictionary[element] = response;
    //         }
    //     })
    // });
    // GameData.forEach(element => {
    //     dataVersionDictionary[element.Name] = DataVersion.Parse(element);
    // });
    // console.log("Dev 1689075214 InitDataVersion "+Object.keys(dataVersionDictionary).length)
}