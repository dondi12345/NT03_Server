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
exports.dataCenterService = void 0;
const Env_1 = require("../../Enviroment/Env");
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const RedisConnect_1 = require("../../Service/Database/RedisConnect");
const DataModel_1 = require("../../Utils/DataModel");
const DataCenterController_1 = require("../Controller/DataCenterController");
const DataVersion_1 = require("../Model/DataVersion");
class DataCenterService {
    constructor() {
        // this.Init();
    }
    Init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.InitData(DataVersion_1.dataCenterName.DataHero);
            this.InitData(DataVersion_1.dataCenterName.DataMonster);
            this.InitData(DataVersion_1.dataCenterName.DataBullet);
            this.InitData(DataVersion_1.dataCenterName.DataDamageEffect);
            this.InitData(DataVersion_1.dataCenterName.DataHeroEquip);
            this.InitData(DataVersion_1.dataCenterName.DataItem);
        });
    }
    InitData(dataName) {
        return __awaiter(this, void 0, void 0, function* () {
            var suc;
            yield DataVersion_1.DataVersionModel.findOne({
                Name: dataName
            }).then(res => {
                var dataVersion = DataModel_1.DataModel.Parse(res);
                if (dataVersion == null || dataVersion == undefined)
                    throw null;
                RedisConnect_1.redisControler.Set(Env_1.RedisKeyConfig.KeyDataCenterDetail(dataName), JSON.stringify(dataVersion));
                dataVersion.Data.forEach(element => {
                    DataCenterController_1.dataCenterController.SetDataElementCached(dataName, element.Code.toString(), JSON.stringify(element));
                });
                LogController_1.logController.LogMessage(LogCode_1.LogCode.Server_InitDataCenterSuc, dataName, "Server");
                suc = true;
                return suc;
            }).catch(err => {
                LogController_1.logController.LogError(LogCode_1.LogCode.DataCenter_InitFail, dataName + ": " + err, "Server");
                suc = false;
                return suc;
            });
            return suc;
        });
    }
}
exports.dataCenterService = new DataCenterService();
