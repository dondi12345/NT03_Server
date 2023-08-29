import Colyseus,{Client, Room} from "colyseus.js";
import { enumUtils } from "../../../Utils/EnumUtils";
import { Message, MessageData } from "../../../MessageServer/Model/Message";
import { DataModel } from "../../../Utils/DataModel";
import { MessageGuessNumber } from "../../GuessNumber/Model/MessageGuessNumber";
import { wordService } from "../../GuessNumber/Service/WordService";
import { AnswerPlayer } from "../../GuessNumber/Model/AnswerPlayer";

enum GuessNumberBotBehaviour{
    None,
    FindingRoom,
    JoiningRoom,
    RoomJoined,
    InGame,
    Guessing,
}

export class GuessNumberBot{
    client : Client
    room : Room
    namePlayer : string

    behaviour : GuessNumberBotBehaviour = GuessNumberBotBehaviour.None;
    delayStep : number = 1;

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
                this.delayStep = Math.floor(Math.random()*3+3);
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
        }
    }

    GuessWorld(){
        console.log("GuessWorld")
        var word = wordService.fourWord[Math.floor(Math.random()*wordService.fourWord.length)]
        var message = new Message();
        message.MessageCode = MessageGuessNumber.player_answer;
        var answerPlayer = new AnswerPlayer();
        answerPlayer.answer = word;
        answerPlayer.pos = 1;
        message.Data = JSON.stringify(answerPlayer);
        this.room.send("message", JSON.stringify(message));
    }
}