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
const MongoConnect_1 = require("./Database/MongoConnect");
const RedisConnect_1 = require("./Database/RedisConnect");
module.exports = {
    InitDatabase: function () {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Dev 1684475639 Init db");
            yield new MongoConnect_1.MongoDBDatabase().connectAsync();
            (0, RedisConnect_1.InitRedisService)();
        });
    },
};
