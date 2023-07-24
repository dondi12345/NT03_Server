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
exports.InitDataVersion = exports.dataVersionDictionary = void 0;
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const LogModel_1 = require("../../LogServer/Model/LogModel");
const DataVersion_1 = require("../Model/DataVersion");
const dataNames = ["TestData", "MonsterData", "BulletData", "DamageEffectData"];
function InitDataVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        exports.dataVersionDictionary = {};
        for (let index = 0; index < dataNames.length; index++) {
            const element = dataNames[index];
            yield (0, DataVersion_1.GetDataVersionByName)(element, (error, response) => {
                if (error) {
                    (0, LogController_1.LogServer)(LogCode_1.LogCode.DataCenter_InitFail, error, LogModel_1.LogType.Error);
                }
                else {
                    exports.dataVersionDictionary[element] = response;
                }
            });
        }
        // GameData.forEach(element => {
        //     dataVersionDictionary[element.Name] = DataVersion.Parse(element);
        // });
        console.log("Dev 1689075214 InitDataVersion " + Object.keys(exports.dataVersionDictionary).length);
    });
}
exports.InitDataVersion = InitDataVersion;
