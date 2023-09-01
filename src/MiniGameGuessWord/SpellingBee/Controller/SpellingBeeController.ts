import { DataModel } from "../../../Utils/DataModel";
import { stringUtils } from "../../../Utils/StringUtils";
import { Message, MessageData } from "../../../MessageServer/Model/Message";
import { StateSpellingBeeRoom } from "../Model/SpellingBeeStateHandler";
import { AnswerSpellingBee, ResultAnswerSpellingBee } from "../Model/AnswerSpellingBee";
import { MessageSpellingBee } from "../Model/MessageSpellingBee";

const Score = {
    correct : 5,
}

class SpellingBeeController{
    PlayerAnswer(room : StateSpellingBeeRoom, message : Message, sessionId : string){
        var clientData = room.clientDatas[sessionId];
        if(clientData == null || clientData ==undefined) return;
        var player = room.state.players.get(sessionId);
        if(player == null || player == undefined){
            var message = new Message();
            message.MessageCode = MessageSpellingBee.answer_inval;
            message.Data = "Not found player";
            var messageData = new MessageData([JSON.stringify(message)]);
            room.sendToClient(JSON.stringify(messageData), clientData.client);
            return;
        }

        var answerPlayer = DataModel.Parse<AnswerSpellingBee>(message.Data)
        if(answerPlayer.answer.length < 3){
            var message = new Message();
            message.MessageCode = MessageSpellingBee.answer_inval;
            message.Data = "Word too short";
            var messageData = new MessageData([JSON.stringify(message)]);
            room.sendToClient(JSON.stringify(messageData), clientData.client);
            return;
        }

        if(!CheckWord(answerPlayer.answer, room.roomConfig.words, clientData.hisAnswer)){
            var message = new Message();
            message.MessageCode = MessageSpellingBee.answer_inval;
            message.Data = "Inval word";
            var messageData = new MessageData([JSON.stringify(message)]);
            room.sendToClient(JSON.stringify(messageData), clientData.client);
            return;
        }
        clientData.hisAnswer.push(answerPlayer.answer);
        player.score += answerPlayer.answer.length*Score.correct;

        var resultAnswerSpellingBee = new ResultAnswerSpellingBee();
        resultAnswerSpellingBee.answers = clientData.hisAnswer;
        var message = new Message();
        message.MessageCode = MessageSpellingBee.result_answer;
        message.Data = JSON.stringify(resultAnswerSpellingBee);
        var messageData = new MessageData([JSON.stringify(message)]);
        room.sendToClient(JSON.stringify(messageData), clientData.client);
    }
}

function CheckWord(word: string, words : string[], answers : string[]){
    var str;
    str = words.find((data)=>(data == word))
    var ans = answers.find((data)=>(data == word))
    if(str == null || str == undefined || str.length == 0){
        return false;
    }else{
        if(ans == null || ans == undefined || ans.length == 0){
            return true;
        }
        return false;
    }
}

export const spellingBeeController = new SpellingBeeController();