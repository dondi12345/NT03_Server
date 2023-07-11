import { LogServer } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { DataVersionDictionary, GetDataVersionByName } from "../Model/DataVersion";

const dataNames = ["TestData"]

export var dataVersionDictionary : DataVersionDictionary;

export function InitDataVersion(){
    let count = 0
    dataNames.forEach(element => {
        GetDataVersionByName(element, (error, response)=>{
            if(error){
                LogServer(LogCode.DataCenter_InitFail, error)
            }else{
                count ++;
                dataVersionDictionary[element] = response;
            }
        })
    });
    console.log("Dev 1689075214 InitDataVersion "+count)
}