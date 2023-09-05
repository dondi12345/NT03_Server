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
exports.redisControler = exports.InitRedisService = exports.redisSub = exports.redisPub = exports.redisClient = void 0;
const redis_1 = require("redis");
const Env_1 = require("../../Enviroment/Env");
const DataModel_1 = require("../../Utils/DataModel");
const MessageRouter_1 = require("../../MessageServer/Router/MessageRouter");
const TransferData_1 = require("../../TransferData");
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
exports.redisClient = (0, redis_1.createClient)({
    host: Env_1.RedisConfig.Host,
    port: Env_1.RedisConfig.Port,
    password: Env_1.RedisConfig.Password,
});
exports.redisPub = (0, redis_1.createClient)({
    host: Env_1.RedisConfig.Host,
    port: Env_1.RedisConfig.Port,
    password: Env_1.RedisConfig.Password,
});
exports.redisSub = (0, redis_1.createClient)({
    host: Env_1.RedisConfig.Host,
    port: Env_1.RedisConfig.Port,
    password: Env_1.RedisConfig.Password,
});
function InitRedisService() {
    console.log("redisClient connecting");
    exports.redisClient.on("error", function (err) {
        console.log("redis went wrong " + err);
    });
    exports.redisClient.on("connect", () => {
        console.log("connect redis success !");
    });
    exports.redisSub.subscribe(Env_1.RedisConfig.MessagePubSub);
    exports.redisSub.on("message", (channel, data) => {
        LogController_1.logController.LogDev("Dev 1691208962 Listion on ", channel);
        var message = DataModel_1.DataModel.Parse(data);
        LogController_1.logController.LogDev("Dev 1691208963: ", data, message);
        MessageRouter_1.messageRouter.Router(message, new TransferData_1.TransferData());
    });
}
exports.InitRedisService = InitRedisService;
class RedisControler {
    Set(key, value) {
        exports.redisClient.set(key, value, (error, result) => {
            if (error) {
                LogController_1.logController.LogError(LogCode_1.LogCode.Server_RedisSetFail, error, "Server");
            }
            else {
                LogController_1.logController.LogMessage(LogCode_1.LogCode.Server_RedisSetSuccess, result + " " + key, "Server");
            }
        });
    }
    Get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            var data = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                yield exports.redisClient.get(key, (error, result) => {
                    if (error) {
                        resolve(null);
                    }
                    else {
                        resolve(result);
                    }
                });
            }));
            if (data == null || data == undefined) {
                LogController_1.logController.LogError(LogCode_1.LogCode.Server_RedisGetNull, key, "Server");
                return null;
            }
            return data;
        });
    }
}
exports.redisControler = new RedisControler();
