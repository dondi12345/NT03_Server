import { io } from "socket.io-client"
import { portConfig, variable } from './Enviroment/Env';
import express from 'express';
import { AuthenGetToken, AuthenVerify } from "./AuthenServer/AuthenController";
import fetch from 'node-fetch';

const app = express()

export function API() {
  app.use(express.json())

  //MessageServer
  let socketMessage
  let resMessage;
  app.get('/message', (req, res) => {
    socketMessage = io("ws://" + variable.localhost + ":" + portConfig.portMessageServer);
    socketMessage.on(variable.eventSocketListening, (arg) => {
      console.log("Dev 1684561396 from MessageServer: " + JSON.stringify(arg));
    })
    socketMessage.on(variable.eventSocketDisconnect, () => {
      console.log("Dev 1685084052 Drop connect from server");
    })
    res.send("Connect MessageServer");
  });
  app.post('/message', (req, res) => {
    if (socketMessage == null) {
      res.send("Not conect to MessageServer")
      return;
    }
    resMessage = res;
    console.log("Dev 1684475504 " + JSON.stringify(req.body));
    socketMessage.emit(variable.eventSocketListening, JSON.stringify(req.body));
    res.send("suc");
  })

  //ChatServer
  let socketChat
  app.get('/chat', (req, res) => {
    socketChat = io("ws://" + variable.localhost + ":" + portConfig.portChatServer);
    socketChat.on(variable.eventSocketListening, (arg) => {
      console.log("Dev 1684568352 from ChatServer: " + arg);
    })
    res.send("Connect to ChatServer");
  });

  app.post('/chat', (req, res) => {
    if (socketChat == null) {
      res.send("Not connect to ChatServer")
      return;
    }
    console.log("Dev 1684568485 " + JSON.stringify(req.body));
    socketChat.emit(variable.eventSocketListening, JSON.stringify(req.body));
    res.send("suc");
  })

  app.post('/getRedis', async (req, res) => {
    var data;
    console.log(req.body)
    for (let index = 0; index < req.body.number1; index++) {
      await Post("http://103.116.9.104:3001/getRedis", {number:req.body.number2}, async (err, res) => {
        data = {
          Index: index,
          Data: res
        };
      })
    }

    res.send(data);
  })
  app.post('/getVar', async (req, res) => {
    var data;
    for (let index = 0; index < req.body.number1; index++) {
      await Post("http://103.116.9.104:3001/getVar", null, async (err, res) => {
        data = {
          Index: index,
          Data: res
        };
      })
    }
    res.send(data);
  })
  app.post('/getDB', async (req, res) => {
    var data;
    for (let index = 0; index < req.body.number1; index++) {
      await Post("http://103.116.9.104:3001/getDB", null, async (err, res) => {
        data = {
          Index: index,
          Data: res
        };
      })
    }
    res.send(data);
  })

  async function Post(url, data,callback) {
    try {
      // 👇️ const response: Response
      const response = await fetch(url, {
        method: 'POST',
        body : data,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = (await response.json());
      return callback(null, result);
    } catch (error) {
      if (error instanceof Error) {
        console.log('error message: ', error.message);
        return callback(error.message, null)
      } else {
        console.log('unexpected error: ', error);
        return callback('An unexpected error occurred', null);
      }
    }
  }

  app.listen(portConfig.portAPI, () => {
    console.log(`Dev 1684475518 Example app listening on port ${portConfig.portAPI}`)
  })
}