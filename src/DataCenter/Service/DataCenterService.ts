import { LogServer } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { DataVersionDictionary, GetDataVersionByName } from "../Model/DataVersion";

const dataNames = ["TestData"]

export var dataVersionDictionary : DataVersionDictionary;

export function InitDataVersion(){
    dataNames.forEach(element => {
        GetDataVersionByName(element, callback=>{
            if(callback.error){
                LogServer(LogCode.DataCenter_InitFail, callback.error)
            }else{
                dataVersionDictionary[element] = callback.response;
            }
        })
    });
}