
import { DataRes, DataResDictionary, Res, } from "../Model/Res";
import { ResData } from "../ResData";

export var DataResService : DataResDictionary;

export function InitRes(){
    DataResService = {}
    ResData.forEach(element => {
        DataResService[element.ResCode] = DataRes.Parse(element);
    });
    console.log("1686211076 InitRes "+ Object.keys(DataResService).length);
    
}