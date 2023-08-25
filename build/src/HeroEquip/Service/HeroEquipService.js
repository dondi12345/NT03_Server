"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitHeroEquip = exports.heroEquipDataDictionary = void 0;
const DataVersion_1 = require("../../DataCenter/Model/DataVersion");
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const LogModel_1 = require("../../LogServer/Model/LogModel");
const DataHeroEquip_1 = require("../DataHeroEquip");
const HeroEquip_1 = require("../Model/HeroEquip");
function InitHeroEquip() {
    return __awaiter(this, void 0, void 0, function* () {
        exports.heroEquipDataDictionary = {};
        yield (0, DataVersion_1.GetDataVersionByName)(DataVersion_1.DataName.DataHeroEquip).then((res) => {
            res.Data.forEach(element => {
                var heroEquipData = HeroEquip_1.HeroEquipData.Parse(element);
                exports.heroEquipDataDictionary[element.Code] = heroEquipData;
            });
        }).catch(err => {
            (0, LogController_1.LogServer)(LogCode_1.LogCode.HeroEquip_InitFail, err, LogModel_1.LogType.Error);
            DataHeroEquip_1.dataHeroEquip.Data.forEach(element => {
                var heroEquipData = HeroEquip_1.HeroEquipData.Parse(element);
                exports.heroEquipDataDictionary[element.Code] = heroEquipData;
            });
        });
        console.log("Dev 1686293177 InitHeroEquip " + Object.keys(exports.heroEquipDataDictionary).length);
    });
}
exports.InitHeroEquip = InitHeroEquip;
