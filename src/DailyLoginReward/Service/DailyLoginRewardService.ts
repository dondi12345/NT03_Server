import { portConfig, variable } from '../../Enviroment/Env';
import express from 'express';
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { DailyLoginRewardCheck, DailyLoginRewardLogin } from '../Controller/DailyLoginRewardController';

export function InitDailyLoginReward(){
    const app = express()
    app.use(express.json())

    app.get('/daily_login_reward', (req, res) =>{

        res.send("Connect to DailyLoginReward");
    });

    app.post('/daily_login_reward',(req, res)=>{
        var message = Message.Parse(req.body)
        console.log("Dev 1688972193 Recive: ",req.body);
        if(message.MessageCode == MessageCode.DailyLoginReward_Login){
            DailyLoginRewardLogin(message, res);
            return;
        }
        if(message.MessageCode == MessageCode.DailyLoginReward_Check){
            DailyLoginRewardCheck(message, res)
            return;
        }
    })

    app.listen(portConfig.portDailyLoginReward, () => {
        console.log(`Dev 1686217636 DailyLoginReward listening on port ${portConfig.portDailyLoginReward}`)
    })
}