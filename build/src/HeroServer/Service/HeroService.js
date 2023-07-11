"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitHero = exports.dataHeroDictionary = void 0;
const DataHero_1 = require("../DataHero");
const Hero_1 = require("../Model/Hero");
function InitHero() {
    exports.dataHeroDictionary = {};
    DataHero_1.DataHero.forEach(element => {
        var dataHero = Hero_1.HeroData.Parse(element);
        exports.dataHeroDictionary[element.Code] = dataHero;
    });
    console.log("Dev 1686293179 InitHeroEquip " + Object.keys(exports.dataHeroDictionary).length);
}
exports.InitHero = InitHero;
