import {DataName, DataVersion, GetDataVersionByName } from "../../DataCenter/Model/DataVersion";
import { LogServer } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { LogType } from "../../LogServer/Model/LogModel";
import { dataHeroEquip } from "../DataHeroEquip";
import { DataHeroEquip, DataHeroEquipDictionary } from "../Model/HeroEquip";

export var dataHeroEquipDictionary : DataHeroEquipDictionary;

export function InitHeroEquip(){
    dataHeroEquipDictionary = {};
    GetDataVersionByName(DataName.DataHeroEquip).then((res: DataVersion)=>{
        res.Data.forEach(element => {
            var dataHeroEquip = DataHeroEquip.Parse(element);
            dataHeroEquipDictionary[element.Code] = dataHeroEquip;
        });
    }).catch(err => {
        LogServer(LogCode.HeroEquip_InitFail, err, LogType.Error)
        dataHeroEquip.Data.forEach(element => {
            var dataHeroEquip = DataHeroEquip.Parse(element);
            dataHeroEquipDictionary[element.Code] = dataHeroEquip;
        });
    })
    console.log("Dev 1686293177 InitHeroEquip "+Object.keys(dataHeroEquipDictionary).length);
}  