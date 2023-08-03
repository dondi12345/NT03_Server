import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { CreateDailyLoginReward, DailyLoginReward, FindDailyLoginRewardByIdUser, UpdateDailyLoginReward } from "../Model/DailyLoginReward";

export async function DailyLoginRewardLogin(message : Message, response) {
    var data = DailyLoginReward.Parse(message.Data);
    FindDailyLoginRewardByIdUser(data.IdUser).then(res=>{
        console.log("Dev 1688972225 ",res)
        if(res == undefined || res == null){
            var dailyLoginReward = new DailyLoginReward();
            dailyLoginReward.IdUser = data.IdUser
            CreateDailyLoginReward(dailyLoginReward);
            var message = new Message();
            message.MessageCode = MessageCode.DailyLoginReward_LoginFail;
            message.Data = JSON.stringify(dailyLoginReward);
            response.send(JSON.stringify(message));
        }else{
            var message = new Message();
            message.MessageCode = MessageCode.DailyLoginReward_LoginSuccess;
            message.Data = JSON.stringify(res);
            response.send(JSON.stringify(message));
        }
    })
}
export async function DailyLoginRewardCheck(message : Message, response) {
    var data = DailyLoginReward.Parse(message.Data);
    FindDailyLoginRewardByIdUser(data.IdUser).then((res : DailyLoginReward)=>{
        console.log("Dev 1688974013 ",res)
        if(res == undefined || res == null){
            var dailyLoginReward = new DailyLoginReward();
            dailyLoginReward.IdUser = data.IdUser
            CreateDailyLoginReward(dailyLoginReward);
            response.send(JSON.stringify(Message_DailyLoginReward_CheckFail(dailyLoginReward)));
        }else{
            var date = new Date();
            var isCheck = false;
            if(date.getUTCFullYear() > res.Year){
                isCheck = true;
            }
            if(date.getUTCMonth()+1 > res.Month){
                isCheck = true;
            }
            if(date.getUTCDate() > res.Day){
                isCheck = true;
            }
            if(isCheck){
                res.Year = date.getUTCFullYear();
                res.Month = date.getUTCMonth()+1;
                res.Day = date.getUTCDate();
                res.Number ++;
                UpdateDailyLoginReward(res);
                response.send(JSON.stringify(Message_DailyLoginReward_CheckSuccess(res)));
            }else{
                response.send(JSON.stringify(Message_DailyLoginReward_CheckFail(res)));
            }
        }
    });
}

function Message_DailyLoginReward_CheckFail(dailyLoginReward){
    var message = new Message();
    message.MessageCode = MessageCode.DailyLoginReward_CheckFail;
    message.Data = JSON.stringify(dailyLoginReward);
    return message;
}
function Message_DailyLoginReward_CheckSuccess(dailyLoginReward){
    var message = new Message();
    message.MessageCode = MessageCode.DailyLoginReward_CheckSuccess;
    message.Data = JSON.stringify(dailyLoginReward);
    return message;
}