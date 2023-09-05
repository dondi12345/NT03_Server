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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitAPIServer = void 0;
const Env_1 = require("../../Enviroment/Env");
const express_1 = __importDefault(require("express"));
const LogController_1 = require("../../LogServer/Controller/LogController");
const Currency_1 = require("../../Currency/Model/Currency");
const TransferData_1 = require("../../TransferData");
const DataModel_1 = require("../../Utils/DataModel");
const APIServerRouter_1 = require("../Router/APIServerRouter");
const TestPerform_1 = require("../../TestPerform/TestPerform");
const RedisConnect_1 = require("../../Service/Database/RedisConnect");
function InitAPIServer() {
    console.log("Dev 1686217639 InitAPIServer");
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
        console.log("==>", DataModel_1.DataModel.Parse(yield RedisConnect_1.redisControler.Get("NT03:DataCenter:DataHeroEquip:Element:10201")).Index);
        console.log("==>", DataModel_1.DataModel.Parse(yield RedisConnect_1.redisControler.Get("NT03:DataCenter:DataHero:Element:105")).Index);
        res.send("Hello world");
    }));
    app.post('/logServer', (req, res) => {
        try {
            (0, LogController_1.LogFromClient)(req.body);
            res.send("Success");
        }
        catch (error) {
            res.send(error);
        }
    });
    app.post('/getRedis', (req, res) => __awaiter(this, void 0, void 0, function* () {
        var data = yield TestPerform_1.testPerform.ReadRedis();
        res.send(data);
    }));
    app.post('/getVar', (req, res) => __awaiter(this, void 0, void 0, function* () {
        var data = yield TestPerform_1.testPerform.ReadVar();
        res.send(data);
    }));
    app.post('/getDB', (req, res) => __awaiter(this, void 0, void 0, function* () {
        var data = yield TestPerform_1.testPerform.ReadDB();
        res.send(data);
    }));
    app.post('/message', (req, res) => {
        var message = DataModel_1.DataModel.Parse(req.body);
        var transferData = new TransferData_1.TransferData();
        transferData.ResAPI = res;
        transferData.Token = message.Token;
        APIServerRouter_1.apiServerRouter.Router(message, transferData);
    });
    app.post('/testFunction', (req, res) => {
        Currency_1.CurrencyModel.updateOne({ _id: "64819daf8e62284b2f2b4baf" }, {
            $inc: {
                "MagicStone": -1
            }
        }).then(response => {
            res.send(response);
        }).catch(error => {
            res.send(error);
        });
    });
    app.listen(Env_1.portConfig.portAPIServer, () => {
        console.log(`Dev 1686217637 APIServer listening on port ${Env_1.portConfig.portAPIServer}`);
    });
}
exports.InitAPIServer = InitAPIServer;
