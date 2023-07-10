import { port, variable } from '../../Enviroment/Env';
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
        if(message.MessageCode == MessageCode.DailyLoginReward_Login){
            DailyLoginRewardLogin(message, res);
            return;
        }
        if(message.MessageCode == MessageCode.DailyLoginReward_Check){
            DailyLoginRewardCheck(message, res)
            return;
        }
    })

    app.listen(port.portAccountServer, () => {
        console.log(`Dev 1686217636 Example app listening on port ${port.portAccountServer}`)
    })
}