import {io} from "socket.io-client"
import { portConfig, variable } from '../../Enviroment/Env';
import express from 'express';
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { AccountServerRouter } from "../../AccountServer/Router/AccountServerRouter";
import { DataCenterRouter } from "../../DataCenter/Router/DataCenterRouter";
import { InitDataVersion } from "../../DataCenter/Service/DataCenterService";
import { LogFromClient } from "../../LogServer/Controller/LogController";
import { CurrencyModel } from "../../Currency/Model/Currency";
import { TransferData } from "../../TransferData";

export function InitAPIServer(){
    console.log("Dev 1686217639 InitAPIServer")
    const app = express()
    app.use(express.json())

    app.post('/account',(req, res)=>{
        var transferData = new TransferData();
        transferData.ResAPI = res;
        AccountServerRouter(req.body, transferData);
    })

    app.post('/datacenter',(req, res)=>{
        DataCenterRouter(req.body, res)
    })
    app.post('/logServer',(req, res)=>{
        try {
            LogFromClient(req.body);
            res.send("Success");
        } catch (error) {
            res.send(error);
        }
    })

    app.post('/testFunction',(req, res)=>{
        CurrencyModel.updateOne({_id : "64819daf8e62284b2f2b4baf"},{
            $inc :{
                "MagicStone" : -1
            }
        }).then(response=>{
            res.send(response);
        }).catch(error=>{
            res.send(error)
        })
    })


    app.listen(portConfig.portAPIServer, () => {
        console.log(`Dev 1686217637 APIServer listening on port ${portConfig.portAPIServer}`)
    })

    InitDataVersion();
}