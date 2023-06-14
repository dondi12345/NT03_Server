
import { ResData, ResDataDictionary, Res, } from "../Model/Res";
import { ResCode } from "../Model/ResCode";
import { DataRes } from "../DataRes";

export var DataResService : ResDataDictionary;

export function InitRes(){
    DataResService = {}
    DataRes.forEach(element => {
        var dataRes = ResData.Parse(element);
        DataResService[element.Code] = dataRes;
    });
    console.log("1686211076 InitRes "+ Object.keys(DataResService).length);
    
}