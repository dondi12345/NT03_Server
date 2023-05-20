import {io} from "socket.io-client"
import { port, variable } from './other/Env';
import express from 'express';

const app = express()

export function API(){
  app.use(express.json())

  //MessageServer
  let socketMessage
  app.get('/message', (req, res) => {
    socketMessage = io("ws://localhost:"+port.portMessageServer);
    socketMessage.on(variable.eventSocketListening, (arg)=>{
      console.log("1684561396 MessageServer: "+arg);
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
    socketChat = io("ws://localhost:"+port.portChatServer);
    socketChat.on(variable.eventSocketListening, (arg)=>{
      console.log("1684568352 ChatServer: "+arg);
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

  app.listen(port.portAPI, () => {
      console.log(`1684475518 Example app listening on port ${port.portAPI}`)
    })
}