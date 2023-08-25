import { io } from "socket.io-client"
import { SocketConfig, portConfig, variable } from './Enviroment/Env';
import express from 'express';
import { AuthenGetToken, AuthenVerify } from "./AuthenServer/AuthenController";
import fetch from 'node-fetch';

const app = express()

export function API() {
  app.use(express.json())

  app.post("/", async (req, res) => {
    
  })

  app.listen(portConfig.portAPI, () => {
    console.log(`Dev 1684475518 Example app listening on port ${portConfig.portAPI}`)
  })
}