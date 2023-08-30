import { Message, MessageData } from "../../../MessageServer/Model/Message";
import { TransferData } from "../../../TransferData";
import { DataModel } from "../../../Utils/DataModel";
import { stringUtils } from "../../../Utils/StringUtils";
import { guessNumberService } from "../Service/GuessNumberService";
import { AnswerPlayer, ResultAnswerPlayer } from "../Model/AnswerPlayer";
import { StateGuessNumberRoom } from "../Model/GuessNumberStateHandler";
import { MessageGuessNumber } from "../Model/MessageGuessNumber";
import { StatusPlayer } from "../Model/StateGuessNumber";
import { wordService } from "../Service/WordService";

export const AnsCheck = {
    correct : "2",
    correctNumber : "1",
    wrong :  "0"
}

const Score = {
    correctNumber : 30,
    correct : 70
}

class GuessNumberController{
    PlayerAnswer(room : StateGuessNumberRoom, message : Message, sessionId : string){
        var answerPlayer = DataModel.Parse<AnswerPlayer>(message.Data)
        if(answerPlayer.answer.length != room.roomConfig.legthPass){
            return;
        }

        var clientData = room.clientDatas[sessionId];
        var player = room.state.players.get(sessionId);
        if(player == null || player == undefined){
            var message = new Message();
            message.MessageCode = MessageGuessNumber.answer_inval;
            message.Data = "Not found player";
            var messageData = new MessageData([JSON.stringify(message)]);
            room.sendToClient(JSON.stringify(messageData), clientData.client);
            return;
        }

        if(player.status == StatusPlayer.Win){
            var message = new Message();
            message.MessageCode = MessageGuessNumber.answer_inval;
            message.Data = "You win";
            var messageData = new MessageData([JSON.stringify(message)]);
            room.sendToClient(JSON.stringify(messageData), clientData.client);
            return;
        }
        
        if(player.numb >= room.roomConfig.maxAnswers){
            var message = new Message();
            message.MessageCode = MessageGuessNumber.answer_inval;
            message.Data = "Wrong fomat answer";
            var messageData = new MessageData([JSON.stringify(message)]);
            room.sendToClient(JSON.stringify(messageData), clientData.client);
            return;
        }
        
        if(!CheckWord(answerPlayer.answer, room.roomConfig.legthPass)){
            var message = new Message();
            message.MessageCode = MessageGuessNumber.answer_inval;
            message.Data = "Inval word";
            var messageData = new MessageData([JSON.stringify(message)]);
            room.sendToClient(JSON.stringify(messageData), clientData.client);
            return;
        }

        var resultAnswerPlayer = new ResultAnswerPlayer();
        var pos : number =+ answerPlayer.pos
        if(pos < player.numb){
            resultAnswerPlayer.pos = clientData.hisAnswer.length -1;
            resultAnswerPlayer.answer = clientData.hisAnswer[resultAnswerPlayer.pos]
            resultAnswerPlayer.result = clientData.hisResult[resultAnswerPlayer.pos]
        }else{
            var result = CheckResult(answerPlayer.answer, room.roomConfig.pass);
            if(player.correct.length == 0){
                player.correct = result;
            }else{
                var score = 0;
                for (let index = 0; index < player.correct.length; index++) {
                    var oldR : number =+ player.correct[index]
                    var newR : number =+ result[index]
                    if(newR > oldR){
                        player.correct = stringUtils.StringRepalce(player.correct, index, result[index]);
                    }
                    if(player.correct[index] == AnsCheck.correctNumber){
                        score += Score.correctNumber;
                    }else if(player.correct[index] == AnsCheck.correct){
                        score += Score.correct;
                    }
                }
                player.score = score;
            }
            player.numb++;
            resultAnswerPlayer.pos = answerPlayer.pos;
            resultAnswerPlayer.answer = answerPlayer.answer;
            resultAnswerPlayer.result = result;
            clientData.hisAnswer.push(answerPlayer.answer);
            clientData.hisResult.push(result);

            var correctAns = "";
            for (let index = 0; index < room.roomConfig.legthPass; index++) {
                correctAns += AnsCheck.correct;
            }
            if(player.numb >= room.roomConfig.maxAnswers){
                player.status = StatusPlayer.Lose;
                resultAnswerPlayer.status = StatusPlayer.Lose;
            }
            if(result == correctAns){
                player.status = StatusPlayer.Win;
                resultAnswerPlayer.status =  StatusPlayer.Win;
                player.score += room.roomData.timeCount;
            }
            var message = new Message();
            message.MessageCode = MessageGuessNumber.result_answer;
            message.Data = JSON.stringify(resultAnswerPlayer);
            var messageData = new MessageData([JSON.stringify(message)]);
            room.sendToClient(JSON.stringify(messageData), clientData.client);
        }
        console.log(player.numb +"-"+ room.roomConfig.maxAnswers)
    }
}

function CheckWord(word: string, length : number){
    var str;
    if(length == 4){
        str = wordService.fourWord.find((data)=>(data == word))
    }
    if(str == null || str == undefined || str.length == 0){
        return false;
    }else{
        return true;
    }
}

function CheckResult(answer : string, pass : string){
    var result = "";
    for (let i = 0; i < answer.length; i++) {
        var check = AnsCheck.wrong;
        for (let j = 0; j < pass.length; j++) {
            if(answer[i] == pass[j]){
                if(i==j){
                    check=AnsCheck.correct;
                }else{
                    if(check == AnsCheck.wrong)
                    check=AnsCheck.correctNumber;
                }
            }
        }
        result+=check;
    }
    return result;
}

export const guessNumberController = new GuessNumberController();