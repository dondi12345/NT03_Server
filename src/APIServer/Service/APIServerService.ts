import { portConfig } from '../../Enviroment/Env';
import express from 'express';
import { Message } from "../../MessageServer/Model/Message";
import { LogFromClient } from "../../LogServer/Controller/LogController";
import { CurrencyModel } from "../../Currency/Model/Currency";
import { TransferData } from "../../TransferData";
import { DataModel } from "../../Utils/DataModel";
import { apiServerRouter } from "../Router/APIServerRouter";
import { testPerform } from "../../TestPerform/TestPerform";
import { redisControler } from '../../Service/Database/RedisConnect';
import { HeroEquipData } from '../../HeroEquip/Model/HeroEquip';
import { HeroData } from '../../HeroServer/Model/Hero';

export function InitAPIServer() {
    console.log("Dev 1686217639 InitAPIServer")
    const app = express()
    app.use(express.json())

    app.post('/', async (req, res) => {
        console.log("==>" ,DataModel.Parse<HeroEquipData>(await redisControler.Get("NT03:DataCenter:DataHeroEquip:Element:10201")).Index)
        console.log("==>" , DataModel.Parse<HeroData>(await redisControler.Get("NT03:DataCenter:DataHero:Element:105")).Index)
        res.send("Hello world")
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
        var data = await testPerform.ReadRedis();
        res.send(data);
    })
    app.post('/getVar', async (req, res) => {
        var data = await testPerform.ReadVar();
        res.send(data);
    })
    app.post('/getDB', async (req, res) => {
        var data = await testPerform.ReadDB();
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
}