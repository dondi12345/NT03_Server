import { HeroEquipData } from "../HeroEquipData";
import { DataHeroEquip, DataHeroEquipDictionary } from "../Model/HeroEquip";

export var dataHeroEquipDictionary : DataHeroEquipDictionary;

export function InitHeroEquip(){
    dataHeroEquipDictionary = {};
    HeroEquipData.forEach(element => {
        var dataHeroEquip = DataHeroEquip.Parse(element);
        dataHeroEquipDictionary[element.Code] = dataHeroEquip;
    });
    console.log("Dev 1686293177 InitHeroEquip "+Object.keys(dataHeroEquipDictionary).length);
}  