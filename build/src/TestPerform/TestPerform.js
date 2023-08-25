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
exports.testPerform = void 0;
const DataVersion_1 = require("../DataCenter/Model/DataVersion");
const RedisConnect_1 = require("../Service/Database/RedisConnect");
const MessageCode_1 = require("../MessageServer/Model/MessageCode");
const TransferData_1 = require("../TransferData");
const Env_1 = require("../Enviroment/Env");
class TestPerform {
    Init() {
        return __awaiter(this, void 0, void 0, function* () {
            var data;
            yield DataVersion_1.DataVersionModel.find({
                Name: "DataMonster"
            }).then(res => {
                data = res;
            });
            this.dataMonster = data;
            console.log("TestPerform Inited");
        });
    }
    constructor() {
        this.Init();
    }
    ReadDB() {
        return __awaiter(this, void 0, void 0, function* () {
            var data;
            for (let index = 0; index < 100; index++) {
                yield DataVersion_1.DataVersionModel.find({
                    Name: "DataMonster"
                }).then(res => {
                    data = {
                        Index: index,
                        Data: JSON.stringify(res),
                    };
                });
            }
            return data;
        });
    }
    ReadRedis() {
        return __awaiter(this, void 0, void 0, function* () {
            var data;
            for (let index = 0; index < 100; index++) {
                data = {
                    Index: index,
                    Data: yield RedisConnect_1.redisControler.Get("NT03:DataCenter:DataMonster"),
                };
            }
            return data;
        });
    }
    ReadVar() {
        var data;
        for (let index = 0; index < 100; index++) {
            data = {
                Index: index,
                Data: JSON.stringify(this.dataMonster),
            };
        }
        return data;
    }
    Router(message, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.MessageCode == MessageCode_1.MessageCode.Server_ReadBD) {
                var data = yield this.ReadDB();
                socket.emit(Env_1.SocketConfig.Listening, JSON.stringify(data));
                return;
            }
            if (message.MessageCode == MessageCode_1.MessageCode.Server_ReadRedis) {
                var data = yield this.ReadRedis();
                socket.emit(Env_1.SocketConfig.Listening, JSON.stringify(data));
                return;
            }
            if (message.MessageCode == MessageCode_1.MessageCode.Server_ReadVar) {
                var data = yield this.ReadVar();
                socket.emit(Env_1.SocketConfig.Listening, JSON.stringify(data));
                return;
            }
            TransferData_1.TransferData;
        });
    }
}
exports.testPerform = new TestPerform();
