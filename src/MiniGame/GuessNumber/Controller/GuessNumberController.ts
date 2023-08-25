import { DataModel } from "../../../Utils/DataModel";
import { stringUtils } from "../../../Utils/StringUtils";
import { guessNumberService } from "../GuessNumberService";
import { AnswerPlayer, ResultAnswerPlayer } from "../Model/AnswerPlayer";
import { StateGuessNumberRoom } from "../Model/GuessNumberStateHandler";
import { Message, MessageCode } from "../Model/Message";
import { StatusPlayer } from "../Model/StateGuessNumber";

const Ans = {
    correct : "2",
    correctNumber : "1",
    wrong :  "0"
}

class GuessNumberController{
    PlayerAnswer(room : StateGuessNumberRoom, message : Message, sessionId : string){
        var answerPlayer = DataModel.Parse<AnswerPlayer>(message.Data)
        if(answerPlayer.answer.length != room.roomData.legthPass){
            return;
        }

        var clientData = room.clientDatas[sessionId];
        var player = room.state.players.get(sessionId);
        if(player == null || player == undefined){
            return;
        }
        
        if(player.numb >= room.roomData.maxAnswers){
            return;
        }
        
        if(!CheckWord(answerPlayer.answer, room.roomData.legthPass)){
            return;
        }

        var resultAnswerPlayer = new ResultAnswerPlayer();
        var pos : number =+ answerPlayer.pos
        if(pos < player.numb){
            resultAnswerPlayer.pos = clientData.hisAnswer.length -1;
            resultAnswerPlayer.answer = clientData.hisAnswer[resultAnswerPlayer.pos]
            resultAnswerPlayer.result = clientData.hisResult[resultAnswerPlayer.pos]
        }else{
            var result = CheckResult(answerPlayer.answer, room.roomData.pass);
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
                    if(player.correct[index] == Ans.correctNumber){
                        score += 10;
                    }else if(player.correct[index] == Ans.correct){
                        score += 20;
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
            for (let index = 0; index < room.roomData.legthPass; index++) {
                correctAns += Ans.correct;
            }
            if(result == correctAns){
                player.status = StatusPlayer.Win;
                var messageWin = new Message();
                messageWin.MessageCode = MessageCode.player_win;
                clientData.client.send("message", JSON.stringify(messageWin));
            }
        }
        var messageCallBack = new Message();
        messageCallBack.MessageCode = MessageCode.result_answer;
        messageCallBack.Data = JSON.stringify(resultAnswerPlayer);
        clientData.client.send("message", JSON.stringify(messageCallBack));
        console.log(player.numb +"-"+ room.roomData.maxAnswers)
        if(player.numb >= room.roomData.maxAnswers){
            player.status = StatusPlayer.Lose;
            var messageLose = new Message();
            messageLose.MessageCode = MessageCode.player_lose;
            clientData.client.send("message", JSON.stringify(messageLose));
        }
    }
}

function CheckWord(word: string, length : number){
    var str;
    if(length == 4){
        str = guessNumberService.fourWord.find((data)=>(data == word))
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
        var check = Ans.wrong;
        for (let j = 0; j < pass.length; j++) {
            if(answer[i] == pass[j]){
                if(i==j){
                    check=Ans.correct;
                }else{
                    if(check == Ans.wrong)
                    check=Ans.correctNumber;
                }
            }
        }
        result+=check;
    }
    return result;
}

export const guessNumberController = new GuessNumberController();