import {io} from "socket.io-client"
import { port, variable } from './Enviroment/Env';
import express from 'express';
import { GetToken, Verify } from "./AuthenServer/AuthenController";

const app = express()

export function API(){
  app.use(express.json())

  //MessageServer
  let socketMessage
  app.get('/message', (req, res) => {
    socketMessage = io("ws://"+variable.localhost+":"+port.portMessageServer);
    socketMessage.on(variable.eventSocketListening, (arg)=>{
      console.log("1684561396 from MessageServer: "+JSON.stringify(arg));
    })
      res.send("Connect MessageServer");
    });
  app.post('/message',(req, res)=>{
    if(socketMessage == null){
      res.send("Not conect to MessageServer")
      return;
    }
    console.log("1684475504 "+ JSON.stringify(req.body));
      socketMessage.emit(variable.eventSocketListening, JSON.stringify(req.body));
      res.send("suc");
  })

  //ChatServer
  let socketChat
  app.get('/chat', (req, res) =>{
    socketChat = io("ws://"+variable.localhost+":"+port.portChatServer);
    socketChat.on(variable.eventSocketListening, (arg)=>{
      console.log("1684568352 from ChatServer: "+arg);
    })
    res.send("Connect to ChatServer");
  });

  app.post('/chat',(req, res)=>{
    if(socketChat == null){
      res.send("Not connect to ChatServer")
      return;
    }
    console.log("1684568485 "+ JSON.stringify(req.body));
    socketChat.emit(variable.eventSocketListening, JSON.stringify(req.body));
      res.send("suc");
  })

  let socketAccount;
  app.get('/account', (req, res) =>{
    socketAccount = io("ws://"+variable.localhost+":"+port.portAccountServer);
    socketAccount.on(variable.eventSocketListening, (arg)=>{
      console.log("1684683425 from AccountServer: "+arg);
    })
    res.send("Connect to AccountServer");
  });

  app.post('/account',(req, res)=>{
    if(socketAccount == null){
      res.send("Not connect to AccountServer")
      return;
    }
    console.log("1684683483 "+ JSON.stringify(req.body));
    socketAccount.emit(variable.eventSocketListening, JSON.stringify(req.body));
    res.send("suc");
  })

  app.listen(port.portAPI, () => {
      console.log(`1684475518 Example app listening on port ${port.portAPI}`)
    })
}