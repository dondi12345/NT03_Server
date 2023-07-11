"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitHeroEquip = exports.dataHeroEquipDictionary = void 0;
const HeroEquipData_1 = require("../HeroEquipData");
const HeroEquip_1 = require("../Model/HeroEquip");
function InitHeroEquip() {
    exports.dataHeroEquipDictionary = {};
    HeroEquipData_1.HeroEquipData.forEach(element => {
        var dataHeroEquip = HeroEquip_1.DataHeroEquip.Parse(element);
        exports.dataHeroEquipDictionary[element.Code] = dataHeroEquip;
    });
    console.log("Dev 1686293177 InitHeroEquip " + Object.keys(exports.dataHeroEquipDictionary).length);
}
exports.InitHeroEquip = InitHeroEquip;
