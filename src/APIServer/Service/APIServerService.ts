import { io } from "socket.io-client"
import { portConfig, variable } from '../../Enviroment/Env';
import express from 'express';
import { Message } from "../../MessageServer/Model/Message";
import { DataCenterRouter } from "../../DataCenter/Router/DataCenterRouter";
import { InitDataVersion, dataCenterService } from "../../DataCenter/Service/DataCenterService";
import { LogFromClient } from "../../LogServer/Controller/LogController";
import { CurrencyModel } from "../../Currency/Model/Currency";
import { TransferData } from "../../TransferData";
import { messageRouter } from "../../MessageServer/Router/MessageRouter";
import { DataModel } from "../../Utils/DataModel";
import { apiServerRouter } from "../Router/APIServerRouter";
import { DataVersionModel } from "../../DataCenter/Model/DataVersion";
import { redisClient, redisControler } from "../../Service/Database/RedisConnect";
import { dataMonster } from "../../DataCenter/Data/MonsterData";

export function InitAPIServer() {
    console.log("Dev 1686217639 InitAPIServer")
    const app = express()
    app.use(express.json())

    app.post('/', (req, res) => {
        res.send("Hello world")
    })

    app.post('/datacenter', (req, res) => {
        DataCenterRouter(req.body, res)
    })
    app.post('/logServer', (req, res) => {
        try {
            LogFromClient(req.body);
            res.send("Success");
        } catch (error) {
            res.send(error);
        }
    })

    app.post('/getRedis', async (req, res) => {
        var data;
        for (let index = 0; index < 100; index++) {
            data = {
                Index: index,
                Data: await redisControler.Get("NT03:DataCenter:DataMonster")
            };
        }
        res.send(data);
    })
    app.post('/getVar', async (req, res) => {
        var data;
        for (let index = 0; index < 100; index++) {
            data = {
                Index: index,
                Data: dataCenterService.dataVersionDictionary["DataMonster"]
            };
        }
        res.send(data);
    })
    app.post('/getDB', async (req, res) => {
        var data;
        for (let index = 0; index < 100; index++) {
            await DataVersionModel.find({
                Name: "DataMonster"
            }).then(respone => {
                data = {
                    Index: index,
                    Data: respone
                };
            })
        }
        res.send(data);
    })

    app.post('/message', (req, res) => {
        var message = DataModel.Parse<Message>(req.body)
        var transferData = new TransferData();
        transferData.ResAPI = res;
        transferData.Token = message.Token;
        apiServerRouter.Router(message, transferData);
    })

    app.post('/testFunction', (req, res) => {
        CurrencyModel.updateOne({ _id: "64819daf8e62284b2f2b4baf" }, {
            $inc: {
                "MagicStone": -1
            }
        }).then(response => {
            res.send(response);
        }).catch(error => {
            res.send(error)
        })
    })


    app.listen(portConfig.portAPIServer, () => {
        console.log(`Dev 1686217637 APIServer listening on port ${portConfig.portAPIServer}`)
    })

    InitDataVersion();
}