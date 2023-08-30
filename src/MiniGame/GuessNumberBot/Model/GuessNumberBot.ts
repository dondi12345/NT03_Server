import Colyseus,{Client, Room} from "colyseus.js";
import { enumUtils } from "../../../Utils/EnumUtils";
import { Message, MessageData } from "../../../MessageServer/Model/Message";
import { DataModel } from "../../../Utils/DataModel";
import { MessageGuessNumber } from "../../GuessNumber/Model/MessageGuessNumber";
import { wordService } from "../../GuessNumber/Service/WordService";
import { AnswerPlayer, ResultAnswerPlayer } from "../../GuessNumber/Model/AnswerPlayer";
import { StatusPlayer } from "../../GuessNumber/Model/StateGuessNumber";
import { AnsCheck } from "../../GuessNumber/Controller/GuessNumberController";

enum GuessNumberBotBehaviour{
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

export class GuessNumberBot{
    client : Client
    room : Room
    namePlayer : string
    clientData : ClientData

    behaviour : GuessNumberBotBehaviour = GuessNumberBotBehaviour.None;
    delayStep : number = 1;

    wordAvailables : string[]
    keyBroadAvailable : string[]
    keyBroadUnavailable : string[]

    Start(){
        var rand = Math.floor(Math.random()*900+100);
        this.namePlayer = "Bot"+rand;
        this.Step();
    }

    Step(){
        console.log("New Step", this.namePlayer,enumUtils.ToString(GuessNumberBotBehaviour, this.behaviour))
        switch (this.behaviour) {
            case GuessNumberBotBehaviour.None:
                this.behaviour = GuessNumberBotBehaviour.FindingRoom;
                this.delayStep = Math.floor(Math.random()*3+3);
                break;
            case GuessNumberBotBehaviour.FindingRoom:
                this.JoinRoom()
                this.delayStep = Math.floor(Math.random()*5+3);
                break;
            case GuessNumberBotBehaviour.Guessing:
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
        console.log("Join room", this.namePlayer)
        this.clientData = new ClientData();
        this.client = new Client("ws://localhost:3007");
        this.OutRoom();
        try {
            this.room = await this.client.joinOrCreate("state_guess_number", {Name : this.namePlayer});
            this.room.onMessage<string>("message", (data)=>{
                this.RecieveMessage(data)
            });
            console.log("joined successfully", this.room.sessionId);
            this.behaviour = GuessNumberBotBehaviour.RoomJoined;
        } catch (e) {
            console.error("join error", e);
        }
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
        console.log("Recive: ",this.namePlayer,messageData.Data);
        for (let index = 0; index < messageData.Data.length; index++) {
            var message = DataModel.Parse<Message>(messageData.Data[index]);
            if(message.MessageCode == MessageGuessNumber.wait_other){
                this.delayStep = 5;
                this.behaviour = GuessNumberBotBehaviour.InGame;
            }
            if(message.MessageCode == MessageGuessNumber.out_room || message.MessageCode == MessageGuessNumber.time_over){
                this.behaviour = GuessNumberBotBehaviour.None;
                this.OutRoom();
                this.delayStep = Math.floor(Math.random()*10+5)
            }
            if(message.MessageCode == MessageGuessNumber.game_start){
                this.behaviour = GuessNumberBotBehaviour.Guessing;
            }
            if(message.MessageCode == MessageGuessNumber.result_answer){
                this.ReciveAnswer(message.Data);
            }
        }
    }

    GuessWorld(){
        console.log("GuessWorld")
        var word = this.wordAvailables[Math.floor(Math.random()*this.wordAvailables.length)]
        var message = new Message();
        message.MessageCode = MessageGuessNumber.player_answer;
        var answerPlayer = new AnswerPlayer();
        answerPlayer.answer = word;
        answerPlayer.pos = this.clientData.hisAnswer.length;
        message.Data = JSON.stringify(answerPlayer);
        this.room.send("message", JSON.stringify(message));
        this.behaviour = GuessNumberBotBehaviour.WaitAnswer;
    }

    ReciveAnswer(data : string){
        this.delayStep = this.delayStep = Math.floor(Math.random()*10+6)
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
        console.log(this.wordAvailables.length)
        this.clientData.status = resultAnswerPlayer.status;
        if(this.clientData.status == StatusPlayer.Win || this.clientData.status == StatusPlayer.Lose){
            this.behaviour = GuessNumberBotBehaviour.WaitEndGame;
            return;
        }else{
            this.behaviour = GuessNumberBotBehaviour.Guessing;
        }
    }
}