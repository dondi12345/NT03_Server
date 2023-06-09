import { HeroEquipData } from "../HeroEquipData";
import { DataHeroEquip } from "../Model/HeroEquip";

export var DataHeroEquipDictionary;

export function InitHeroEquip(){
    DataHeroEquipDictionary = {};
    HeroEquipData.forEach(element => {
        var dataHeroEquip = DataHeroEquip.Parse(element);
        DataHeroEquipDictionary[element.Index] = dataHeroEquip;
    });
    console.log("1686293177 InitHeroEquip "+Object.keys(DataHeroEquipDictionary).length);
}  