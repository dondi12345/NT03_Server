import {io} from "socket.io-client"
import { port, variable } from '../../Enviroment/Env';
import express from 'express';
import { AuthenGetToken, AuthenVerify } from "../../AuthenServer/AuthenController";
import { Account, CountAccount } from "../Model/Account";
import { AccountLogin, AccountLoginTocken, AccountRegister } from "../Controller/AccountController";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { scheduleJob } from 'node-schedule';

export async function InitAccountServer(){
    // var timeSk = '0 0 */1 * * *'
    var timeSk = '0 0 */1 * * *';
    const countAccount = scheduleJob(timeSk,()=> 
    {
        CountAccount((error, response)=>{
            console.log("Dev 1689049933 Account:", response);
        })
    });

}