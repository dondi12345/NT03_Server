import {io} from "socket.io-client"
import { port, variable } from '../../Enviroment/Env';
import express from 'express';
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { AccountServerRouter } from "../../AccountServer/Router/AccountServerRouter";
import { DataCenterRouter } from "../../DataCenter/Router/DataCenterRouter";
import { InitDataVersion } from "../../DataCenter/Service/DataCenterService";
import { LogFromClient } from "../../LogServer/Controller/LogController";

export function InitAPIServer(){
    console.log("Dev 1686217639 InitAPIServer")
    const app = express()
    app.use(express.json())

    app.post('/account',(req, res)=>{
        AccountServerRouter(req.body, res);
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

    app.listen(port.portAPIServer, () => {
        console.log(`Dev 1686217637 APIServer listening on port ${port.portAPIServer}`)
    })

    InitDataVersion();
}