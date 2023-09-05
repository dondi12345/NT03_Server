import Colyseus, { Client, Room } from "colyseus.js";
import { enumUtils } from "../../../Utils/EnumUtils";
import { logController } from "../../../LogServer/Controller/LogController";
import { DataModel } from "../../../Utils/DataModel";
import { Message, MessageData } from "../../../MessageServer/Model/Message";
import { portConfig } from "../../../Enviroment/Env";
import { RoomSpellingBeeData } from "../../SpellingBee/Model/SpellingBeeStateHandler";
import { MessageSpellingBee } from "../../SpellingBee/Model/MessageSpellingBee";
import { AnswerSpellingBee, ResultAnswerSpellingBee } from "../../SpellingBee/Model/AnswerSpellingBee";
import { readFileSync } from 'fs';
import { rootDir } from '../../../..';
import path from 'path';

enum SpellingBeeBotBehaviour {
    None,
    FindingRoom,
    JoiningRoom,
    RoomJoined,
    InGame,
    Guessing,
    WaitAnswer,
    WaitEndGame,
}

class ClientData {
    answers: string[] = [];
    words: string[] = [];
}
const LINE_EXPRESSION: RegExp = /\r\n|\n\r|\n|\r/g;
export class SpellingBeeBot {
    client: Client
    room: Room
    namePlayer: string
    clientData: ClientData
    roomData: RoomSpellingBeeData

    behaviour: SpellingBeeBotBehaviour = SpellingBeeBotBehaviour.None;
    oldBehaviour: SpellingBeeBotBehaviour = SpellingBeeBotBehaviour.None;
    countSame: number = 0;
    delayStep: number = 1;

    Start() {
        var rand = Math.floor(Math.random() * 900 + 100);
        this.namePlayer = "Bot" + rand;
        this.Step();
        this.delayStep = Math.floor(Math.random() * 15 + 4);
    }

    Step() {
        logController.LogDev("Dev New Step", this.namePlayer, enumUtils.ToString(SpellingBeeBotBehaviour, this.behaviour))
        if (this.behaviour == this.oldBehaviour) {
            this.countSame++;
            if (this.countSame >= 10) {
                this.behaviour = SpellingBeeBotBehaviour.None;
            }
        } else {
            this.countSame = 0;
            this.oldBehaviour = this.behaviour;
        }
        switch (this.behaviour) {
            case SpellingBeeBotBehaviour.None:
                this.behaviour = SpellingBeeBotBehaviour.FindingRoom;
                this.delayStep = Math.floor(Math.random() * 10 + 10);
                break;
            case SpellingBeeBotBehaviour.FindingRoom:
                this.JoinRoom()
                this.delayStep = Math.floor(Math.random() * 10 + 5);
                break;
            case SpellingBeeBotBehaviour.Guessing:
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

    async JoinRoom() {
        logController.LogDev("Dev Join room", this.namePlayer)
        this.clientData = new ClientData();
        this.client = new Client("ws://localhost:" + portConfig.portMiniGameWord);
        this.OutRoom();
        try {
            this.room = await this.client.join("state_spelling_bee", { Name: this.namePlayer });
            this.room.onMessage<string>("message", (data) => {
                this.RecieveMessage(data)
            });
            logController.LogDev("Dev joined successfully", this.room.sessionId);
            this.behaviour = SpellingBeeBotBehaviour.RoomJoined;
        } catch (e) {
            // logController.LogDev("Dev join error", e);
        }
        this.behaviour = SpellingBeeBotBehaviour.None;
    }

    OutRoom() {
        try {
            this.room.leave();
        } catch (error) {

        }
    }

    RecieveMessage(data: string) {
        var messageData = DataModel.Parse<MessageData>(data);
        logController.LogDev("Dev Recive: ", this.namePlayer, messageData.Data);
        for (let index = 0; index < messageData.Data.length; index++) {
            var message = DataModel.Parse<Message>(messageData.Data[index]);
            if (message.MessageCode == MessageSpellingBee.update_room) {
                this.roomData = DataModel.Parse(message.Data);
            }
            if (message.MessageCode == MessageSpellingBee.wait_other) {
                this.delayStep = 5;
                this.behaviour = SpellingBeeBotBehaviour.InGame;
            }
            if (message.MessageCode == MessageSpellingBee.out_room || message.MessageCode == MessageSpellingBee.time_over) {
                this.behaviour = SpellingBeeBotBehaviour.None;
                this.OutRoom();
                this.delayStep = Math.floor(Math.random() * 10 + 5)
            }
            if (message.MessageCode == MessageSpellingBee.game_start) {
                this.behaviour = SpellingBeeBotBehaviour.Guessing;
            }
            if (message.MessageCode == MessageSpellingBee.result_answer) {
                this.ReciveAnswer(message.Data);
            }
        }
    }

    GuessWorld() {
        logController.LogDev("Dev GuessWorld")
        if (this.clientData.words.length == 0) {
            this.InitWord()
        }
        var word = this.clientData.words[Math.floor(Math.random() * this.clientData.words.length)]
        var message = new Message();
        message.MessageCode = MessageSpellingBee.player_answer;
        var answerPlayer = new AnswerSpellingBee();
        answerPlayer.answer = word;
        message.Data = JSON.stringify(answerPlayer);
        this.room.send("message", JSON.stringify(message));
        this.behaviour = SpellingBeeBotBehaviour.WaitAnswer;
    }

    InitWord() {
        const result = readFileSync(path.join(rootDir + '/public/resources/guess_word/enwords.txt'), 'utf-8');
        var words = result.split(`\n`);
        words.forEach(element => {
            element = element.toLowerCase()
            element = element.replace(LINE_EXPRESSION, '')
            var same = false;
            for (let index = 0; index < element.length; index++) {
                if (element[index].toString() == this.roomData.sub[0]) {
                    same = true;
                    break;
                }
            }
            if (same == true) {
                var done = true;
                for (let index = 0; index < element.length; index++) {
                    var same_1 = false;
                    for (let i = 0; i < this.roomData.sub.length; i++) {
                        if (element[index].toString() == this.roomData.sub[i]) {
                            same_1 = true;
                            break;
                        }
                    }
                    if (same_1 == false) {
                        done = false;
                        break;
                    }
                }
                if (done == true) {
                    this.clientData.words.push(element);
                }
            }
        });
    }

    ReciveAnswer(data: string) {
        var numb = 0;
        if(this.clientData.answers.length > 10){
            numb = 10;
        }
        if(this.clientData.answers.length > 20){
            numb = 20;
        }
        if(this.clientData.answers.length > 30){
            numb = 30;
        }
        this.delayStep = this.delayStep = Math.floor(Math.random() * numb + 10)
        var resultAnswerPlayer = DataModel.Parse<ResultAnswerSpellingBee>(data);
        this.clientData.answers = resultAnswerPlayer.answers;
        const index = this.clientData.words.indexOf(resultAnswerPlayer.answers[resultAnswerPlayer.answers.length - 1], 0);
        this.clientData.words.splice(index, 1);
        this.behaviour = SpellingBeeBotBehaviour.Guessing;
    }
}