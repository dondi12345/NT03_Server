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
exports.dataCenterController = void 0;
const Env_1 = require("../../Enviroment/Env");
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const RedisConnect_1 = require("../../Service/Database/RedisConnect");
const DataModel_1 = require("../../Utils/DataModel");
const DataCenterService_1 = require("../Service/DataCenterService");
class DataCenterController {
    CheckVersion(message, transferData) {
        return __awaiter(this, void 0, void 0, function* () {
            var dataVersion = DataModel_1.DataModel.Parse(message.Data);
            var dataDetail = DataModel_1.DataModel.Parse(yield RedisConnect_1.redisControler.Get(Env_1.RedisKeyConfig.KeyDataCenterDetail(dataVersion.Name)));
            if (dataDetail == null || dataDetail == undefined) {
                LogController_1.logController.LogError(LogCode_1.LogCode.DataCenter_NotFoundInCache, dataVersion.Name, "Server");
                var messageCallback = new Message_1.Message();
                messageCallback.MessageCode = MessageCode_1.MessageCode.DataCenter_FailUpdate;
                messageCallback.Data = JSON.stringify(dataVersion);
                transferData.Send(JSON.stringify(messageCallback));
                return;
            }
            if (dataDetail.Version == dataVersion.Version) {
                var messageCallback = new Message_1.Message();
                messageCallback.MessageCode = MessageCode_1.MessageCode.DataCenter_VersionUpToDate;
                messageCallback.Data = JSON.stringify(dataVersion);
                transferData.Send(JSON.stringify(messageCallback));
                LogController_1.logController.LogDev("1692076265 Up to date");
            }
            else {
                var messageCallback = new Message_1.Message();
                messageCallback.MessageCode = MessageCode_1.MessageCode.DataCenter_VersionUpdate;
                messageCallback.Data = JSON.stringify(dataDetail);
                transferData.Send(JSON.stringify(messageCallback));
                LogController_1.logController.LogDev("1692076266 Update");
            }
        });
    }
    ReloadData(message, transferData) {
        return __awaiter(this, void 0, void 0, function* () {
            var dataVersion = DataModel_1.DataModel.Parse(message.Data);
            var suc = yield DataCenterService_1.dataCenterService.InitData(dataVersion.Name);
            var messageCallback = new Message_1.Message();
            if (suc)
                messageCallback.MessageCode = MessageCode_1.MessageCode.DataCenter_UpdateVersionSuc;
            else
                messageCallback.MessageCode = MessageCode_1.MessageCode.DataCenter_UpdateVersionFail;
            transferData.Send(JSON.stringify(messageCallback));
        });
    }
    GetDataElementCached(dataName, code) {
        return __awaiter(this, void 0, void 0, function* () {
            var dataJson = yield new Promise((reslove, rejects) => __awaiter(this, void 0, void 0, function* () {
                reslove(yield RedisConnect_1.redisControler.Get(Env_1.RedisKeyConfig.KeyDataCenterElement(dataName, code)));
            }));
            if (dataJson == null || dataJson == undefined) {
                LogController_1.logController.LogError(LogCode_1.LogCode.DataCenter_NotFoundInCache, dataName, "Server");
                return null;
            }
            return dataJson;
        });
    }
    SetDataElementCached(dataName, code, data) {
        return __awaiter(this, void 0, void 0, function* () {
            RedisConnect_1.redisControler.Set(Env_1.RedisKeyConfig.KeyDataCenterElement(dataName, code), JSON.stringify(data));
        });
    }
}
exports.dataCenterController = new DataCenterController();
