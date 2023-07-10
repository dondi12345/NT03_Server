import { IMessage, Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { CreateDailyLoginReward, DailyLoginReward, FindDailyLoginRewardByIdUser } from "../Model/DailyLoginReward";

export async function DailyLoginRewardLogin(message : IMessage, response) {
    var data = DailyLoginReward.Parse(message.Data);
    FindDailyLoginRewardByIdUser(data.IdUser).then(res=>{
        if(res == undefined || res == null){
            var dailyLoginReward = new DailyLoginReward();
            dailyLoginReward.IdUser = data.IdUser
            CreateDailyLoginReward(dailyLoginReward);
            var message = new Message();
            message.MessageCode = MessageCode.DailyLoginReward_Login;
            message.Data = JSON.stringify(dailyLoginReward);
            response.send(JSON.stringify(message));
        }else{
            var message = new Message();
            message.MessageCode = MessageCode.DailyLoginReward_Login;
            message.Data = JSON.stringify(res);
            response.send(JSON.stringify(message));
        }
    })
}
export async function DailyLoginRewardCheck(message : IMessage, response) {

}