import {io} from "socket.io-client"
import { port, variable } from '../../Enviroment/Env';
import express from 'express';
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { AccountServerRouter } from "../../AccountServer/Router/AccountServerRouter";

export function InitAPIServer(){
    const app = express()
    app.use(express.json())

    app.post('/account',(req, res)=>{
        AccountServerRouter(req.body, res);
    })

    app.listen(port.portAPIServer, () => {
        console.log(`Dev 1686217636 AccountServer listening on port ${port.portAPIServer}`)
    })
}