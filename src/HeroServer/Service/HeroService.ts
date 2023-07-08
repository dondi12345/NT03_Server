import { DataHero } from "../DataHero";
import { DataHeroDictionary, HeroData } from "../Model/Hero";

export var dataHeroDictionary : DataHeroDictionary;

export function InitHero(){
    dataHeroDictionary = {};
    DataHero.forEach(element => {
        var dataHero = HeroData.Parse(element);
        dataHeroDictionary[element.Code] = dataHero;
    });
    console.log("Dev 1686293179 InitHeroEquip "+Object.keys(dataHeroDictionary).length);
}