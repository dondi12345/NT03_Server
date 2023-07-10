import {io} from "socket.io-client"
import { port, variable } from '../../Enviroment/Env';
import express from 'express';
import { AuthenGetToken, AuthenVerify } from "../../AuthenServer/AuthenController";
import { Account } from "../Model/Account";
import { AccountLogin, AccountLoginTocken, AccountRegister } from "../Controller/AccountController";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";


export function InitAccountServer(){
    const app = express()
    app.use(express.json())

    app.get('/account', (req, res) =>{

        res.send("Connect to AccountServer");
    });

    app.post('/account',(req, res)=>{
        var message = Message.Parse(req.body)
        if(message.MessageCode == MessageCode.AccountServer_Register){
            AccountRegister(message, res);
            return;
        }
        if(message.MessageCode == MessageCode.AccountServer_Login){
            AccountLogin(message, res)
            return;
        }
        if(message.MessageCode == MessageCode.AccountServer_LoginToken){
            AccountLoginTocken(message, res);
            return;
        }
    })

    app.listen(port.portAccountServer, () => {
        console.log(`Dev 1686217636 AccountServer listening on port ${port.portAccountServer}`)
    })
}