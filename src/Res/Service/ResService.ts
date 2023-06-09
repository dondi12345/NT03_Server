
import { DataRes, DataResDictionary, Res, } from "../Model/Res";
import { ResCode } from "../Model/ResCode";
import { ResData } from "../ResData";

export var DataResService : DataResDictionary;

export function InitRes(){
    DataResService = {}
    ResData.forEach(element => {
        var dataRes = DataRes.Parse(element);
        DataResService[element.Index] = dataRes;
        console.log("1686292216 "+JSON.stringify(dataRes));
    });
    console.log("1686211076 InitRes "+ Object.keys(DataResService).length);
    
}