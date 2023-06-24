import {io} from "socket.io-client"
import { port, variable } from './Enviroment/Env';
import express from 'express';
import { AuthenGetToken, AuthenVerify } from "./AuthenServer/AuthenController";

const app = express()

export function API(){
  app.use(express.json())

  //MessageServer
  let socketMessage
  let resMessage;
  app.get('/message', (req, res) => {
    socketMessage = io("ws://"+variable.localhost+":"+port.portMessageServer);
    socketMessage.on(variable.eventSocketListening, (arg)=>{
      console.log("Dev 1684561396 from MessageServer: "+JSON.stringify(arg));
    })
    socketMessage.on(variable.eventSocketDisconnect,()=>{
      console.log("Dev 1685084052 Drop connect from server");
    })
      res.send("Connect MessageServer");
    });
  app.post('/message',(req, res)=>{
    if(socketMessage == null){
      res.send("Not conect to MessageServer")
      return;
    }
    resMessage = res;
    console.log("Dev 1684475504 "+ JSON.stringify(req.body));
      socketMessage.emit(variable.eventSocketListening, JSON.stringify(req.body));
      res.send("suc");
  })

  //ChatServer
  let socketChat
  app.get('/chat', (req, res) =>{
    socketChat = io("ws://"+variable.localhost+":"+port.portChatServer);
    socketChat.on(variable.eventSocketListening, (arg)=>{
      console.log("Dev 1684568352 from ChatServer: "+arg);
    })
    res.send("Connect to ChatServer");
  });

  app.post('/chat',(req, res)=>{
    if(socketChat == null){
      res.send("Not connect to ChatServer")
      return;
    }
    console.log("Dev 1684568485 "+ JSON.stringify(req.body));
    socketChat.emit(variable.eventSocketListening, JSON.stringify(req.body));
      res.send("suc");
  })

  app.listen(port.portAPI, () => {
      console.log(`Dev 1684475518 Example app listening on port ${port.portAPI}`)
    })
}