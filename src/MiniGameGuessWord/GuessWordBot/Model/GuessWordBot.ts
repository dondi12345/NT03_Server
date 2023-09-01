import Colyseus,{Client, Room} from "colyseus.js";
import { MessageGuessWord } from "../../GuessWord/Model/MessageGuessWord";
import { wordService } from "../../GuessWord/Service/WordService";
import { AnswerPlayer, ResultAnswerPlayer } from "../../GuessWord/Model/AnswerPlayer";
import { StatusPlayer } from "../../GuessWord/Model/StateGuessWord";
import { AnsCheck } from "../../GuessWord/Controller/GuessWordController";
import { enumUtils } from "../../../Utils/EnumUtils";
import { logController } from "../../../LogServer/Controller/LogController";
import { DataModel } from "../../../Utils/DataModel";
import { Message, MessageData } from "../../../MessageServer/Model/Message";
import { portConfig } from "../../../Enviroment/Env";

enum GuessWordBotBehaviour{
    None,
    FindingRoom,
    JoiningRoom,
    RoomJoined,
    InGame,
    Guessing,
    WaitAnswer,
    WaitEndGame,
}

class ClientData{
    hisAnswer : string[] = [];
    hisResult : string[] = [];
    status : number = 0;
}

export class GuessWordBot{
    client : Client
    room : Room
    namePlayer : string
    clientData : ClientData

    behaviour : GuessWordBotBehaviour = GuessWordBotBehaviour.None;
    oldBehaviour : GuessWordBotBehaviour = GuessWordBotBehaviour.None;
    countSame : number = 0;
    delayStep : number = 1;

    wordAvailables : string[]
    keyBroadAvailable : string[]
    keyBroadUnavailable : string[]

    Start(){
        var rand = Math.floor(Math.random()*900+100);
        this.namePlayer = "Bot"+rand;
        this.Step();
        this.delayStep = Math.floor(Math.random()*15+4);
    }

    Step(){
        logController.LogDev("Dev New Step", this.namePlayer,enumUtils.ToString(GuessWordBotBehaviour, this.behaviour))
        if(this.behaviour == this.oldBehaviour){
            this.countSame ++;
            if(this.countSame >= 10){
                this.behaviour = GuessWordBotBehaviour.None;
            }
        }else{
            this.countSame = 0;
            this.oldBehaviour = this.behaviour;
        }
        switch (this.behaviour) {
            case GuessWordBotBehaviour.None:
                this.behaviour = GuessWordBotBehaviour.FindingRoom;
                this.delayStep = Math.floor(Math.random()*10+10);
                break;
            case GuessWordBotBehaviour.FindingRoom:
                this.JoinRoom()
                this.delayStep = Math.floor(Math.random()*10+5);
                break;
            case GuessWordBotBehaviour.Guessing:
                this.GuessWorld();
                break;
            default:
                this.delayStep = 3;
                break;
        }

        setTimeout(() => {
            this.Step();
        }, this.delayStep * 1000)
    }

    async JoinRoom(){
        logController.LogDev("Dev Join room", this.namePlayer)
        this.clientData = new ClientData();
        this.client = new Client("ws://localhost:"+portConfig.portGuessNumber);
        this.OutRoom();
        try {
            this.room = await this.client.join("state_guess_number", {Name : this.namePlayer});
            this.room.onMessage<string>("message", (data)=>{
                this.RecieveMessage(data)
            });
            logController.LogDev("Dev joined successfully", this.room.sessionId);
            this.behaviour = GuessWordBotBehaviour.RoomJoined;
        } catch (e) {
            // logController.LogDev("Dev join error", e);
        }
        this.behaviour = GuessWordBotBehaviour.None;
        this.wordAvailables =[]
        this.keyBroadAvailable =[]
        this.keyBroadUnavailable =[]
        for (let index = 0; index < wordService.fourWord.length; index++) {
            this.wordAvailables.push(wordService.fourWord[index]);
        }
    }

    OutRoom(){
        try {
            this.room.leave();
        } catch (error) {

        }
    }

    RecieveMessage(data : string){
        var messageData = DataModel.Parse<MessageData>(data);
        logController.LogDev("Dev Recive: ",this.namePlayer,messageData.Data);
        for (let index = 0; index < messageData.Data.length; index++) {
            var message = DataModel.Parse<Message>(messageData.Data[index]);
            if(message.MessageCode == MessageGuessWord.wait_other){
                this.delayStep = 5;
                this.behaviour = GuessWordBotBehaviour.InGame;
            }
            if(message.MessageCode == MessageGuessWord.out_room || message.MessageCode == MessageGuessWord.time_over){
                this.behaviour = GuessWordBotBehaviour.None;
                this.OutRoom();
                this.delayStep = Math.floor(Math.random()*10+5)
            }
            if(message.MessageCode == MessageGuessWord.game_start){
                this.behaviour = GuessWordBotBehaviour.Guessing;
            }
            if(message.MessageCode == MessageGuessWord.result_answer){
                this.ReciveAnswer(message.Data);
            }
        }
    }

    GuessWorld(){
        logController.LogDev("Dev GuessWorld")
        var word = this.wordAvailables[Math.floor(Math.random()*this.wordAvailables.length)]
        var message = new Message();
        message.MessageCode = MessageGuessWord.player_answer;
        var answerPlayer = new AnswerPlayer();
        answerPlayer.answer = word;
        answerPlayer.pos = this.clientData.hisAnswer.length;
        message.Data = JSON.stringify(answerPlayer);
        this.room.send("message", JSON.stringify(message));
        this.behaviour = GuessWordBotBehaviour.WaitAnswer;
    }

    ReciveAnswer(data : string){
        this.delayStep = this.delayStep = Math.floor(Math.random()*30+10)
        var resultAnswerPlayer = DataModel.Parse<ResultAnswerPlayer>(data);
        this.clientData.hisAnswer.push(resultAnswerPlayer.answer);
        this.clientData.hisResult.push(resultAnswerPlayer.result);
        for (let index = 0; index < resultAnswerPlayer.result.length; index++) {
            if(resultAnswerPlayer.result[index].toString()== AnsCheck.wrong){
                this.keyBroadUnavailable.push(resultAnswerPlayer.answer[index].toString())
            }else{
                this.keyBroadAvailable.push(resultAnswerPlayer.answer[index].toString())
            }
        }
        for (let index = 0; index < resultAnswerPlayer.result.length; index++) {
            if(resultAnswerPlayer.result[index].toString()== AnsCheck.wrong){
                this.keyBroadUnavailable.push(resultAnswerPlayer.answer[index].toString())
            }else{
                this.keyBroadAvailable.push(resultAnswerPlayer.answer[index].toString())
            }
        }
        for (let index = this.wordAvailables.length -1; index >= 0; index--) {
            var remove = false;
            for (let i = 0; i < this.keyBroadUnavailable.length; i++) {
                if(this.wordAvailables[index].indexOf(this.keyBroadUnavailable[i])>-1){
                    remove = true;
                    break;
                }
            }
            if(remove == true){
                this.wordAvailables.splice(index,1);
                continue;
            }
            remove = false;
            for (let i = 0; i < this.keyBroadAvailable.length; i++) {
                if(this.wordAvailables[index].indexOf(this.keyBroadAvailable[i])==-1){
                    remove = true;
                    break;
                }

            }
            if(remove == true){
                this.wordAvailables.splice(index,1);
                continue;
            }
        }
        this.clientData.status = resultAnswerPlayer.status;
        if(this.clientData.status == StatusPlayer.Win || this.clientData.status == StatusPlayer.Lose){
            this.behaviour = GuessWordBotBehaviour.WaitEndGame;
            return;
        }else{
            this.behaviour = GuessWordBotBehaviour.Guessing;
        }
    }
}