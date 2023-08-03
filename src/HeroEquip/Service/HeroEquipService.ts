import {DataName, DataVersion, GetDataVersionByName } from "../../DataCenter/Model/DataVersion";
import { LogServer } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { LogType } from "../../LogServer/Model/LogModel";
import { dataHeroEquip } from "../DataHeroEquip";
import { HeroEquipData, HeroEquipDataDictionary } from "../Model/HeroEquip";

export var heroEquipDataDictionary : HeroEquipDataDictionary;

export async function InitHeroEquip(){
    heroEquipDataDictionary = {};
    await GetDataVersionByName(DataName.DataHeroEquip).then((res: DataVersion)=>{
        res.Data.forEach(element => {
            var heroEquipData = HeroEquipData.Parse(element);
            heroEquipDataDictionary[element.Code] = heroEquipData;
        });
    }).catch(err => {
        LogServer(LogCode.HeroEquip_InitFail, err, LogType.Error)
        dataHeroEquip.Data.forEach(element => {
            var heroEquipData = HeroEquipData.Parse(element);
            heroEquipDataDictionary[element.Code] = heroEquipData;
        });
    })
    console.log("Dev 1686293177 InitHeroEquip "+Object.keys(heroEquipDataDictionary).length);
}  