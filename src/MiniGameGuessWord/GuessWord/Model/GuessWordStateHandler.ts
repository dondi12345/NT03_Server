import { Room, Client, Delayed } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { StateGuessWord } from "./StateGuessWord";
import { guessWordRouter } from "../Router/GuessWordRouter";
import { DataModel } from "../../../Utils/DataModel";
import { PlayerGuessWord } from "./PlayerGuessWord";
import { Message, MessageData } from "../../../MessageServer/Model/Message";
import { MessageGuessWord } from "./MessageGuessWord";
import { wordService } from "../Service/WordService";
import { logController } from "../../../LogServer/Controller/LogController";

export class ClientData{
    client : Client;
    hisAnswer : string [] = [];
    hisResult : string [] = [];

    resetData(){
        this.hisAnswer = [];
        this.hisResult = [];
    }
}
export type ClientDataDictionary = Record<string, ClientData>;
export class RoomGuessWordConfig{
    pass : string;
    legthPass : number;
    maxAnswers : number;
}

const timeVar = {
    delayStart : 15,
    durationGame : 180,
    delay_time_over : 10,
}

const game_status = {
    game_start : 1,
    game_end : 0,
    time_over : 2,
}

export class RoomData{
    timeCount : number = 0;
    gameStatus : number = 0;
}

export class StateGuessWordRoom extends Room<StateGuessWord> {
    maxClients = 5;

    clientDatas : ClientDataDictionary
    roomConfig : RoomGuessWordConfig = new RoomGuessWordConfig();
    roomData : RoomData = new RoomData();
    delayedInterval!: Delayed;

    onCreate (options) {
        console.log("StateHandlerRoom created!", options);
        this.inti();
        var state = new StateGuessWord();
        this.clientDatas = {}
        this.setState(state);
        this.onMessage("message", (client, data)=>{
            logController.LogDev("Dev Recive: ", data);
            var message = DataModel.Parse<Message>(data);
            guessWordRouter.Router(this, message, client.sessionId);
        })
        this.delayedInterval = this.clock.setInterval(() => {
            this.roomData.timeCount--;
            this.checkTime();
        }, 1000);
    }

    inti(){
        this.roomConfig = new RoomGuessWordConfig();
        this.roomConfig.legthPass = 4;
        this.roomConfig.maxAnswers = 5;
        this.roomData = new RoomData();
        this.roomData.timeCount = timeVar.delayStart;
        this.resetData();
    }

    resetData(){
        this.roomConfig.pass = "";
        switch (this.roomConfig.legthPass) {
            default:
                this.roomConfig.pass = wordService.fourWord[Math.floor(Math.random()*wordService.fourWord.length)];
                break;
        }
        console.log("Pass: ", this.roomConfig.pass);
    }

    onJoin (client: Client, options) {
        logController.LogDev("Dev", options);
        var clientData = new ClientData();
        clientData.client = client;
        this.clientDatas[client.sessionId] = clientData;
        logController.LogDev("Dev", options.Name, client.sessionId, "joined!");
        this.state.createPlayer(client.sessionId, options.Name);

        var message = new Message();
        message.MessageCode = MessageGuessWord.wait_other;
        if(this.roomData.gameStatus == game_status.game_start) message.MessageCode = MessageGuessWord.game_start;
        if(this.roomData.gameStatus == game_status.time_over) message.MessageCode = MessageGuessWord.time_over;
        var messageUdRoom = new Message();
        messageUdRoom.MessageCode = MessageGuessWord.update_room;
        messageUdRoom.Data = JSON.stringify(this.roomData)
        var messageData = new MessageData([JSON.stringify(messageUdRoom), JSON.stringify(message)]);
        logController.LogDev("Dev", JSON.stringify(messageData));
        this.sendToClient(JSON.stringify(messageData), client);

        if(Object.keys(this.clientDatas).length >= this.maxClients){
            this.roomData.timeCount = 0;
        }
    }

    onLeave (client) {
        logController.LogDev("Dev", client.sessionId, "left!");
        try {
            delete this.clientDatas[client.sessionId]
        } catch (error) {
            logController.LogDev("Dev error: ", error);
        }
        this.state.removePlayer(client.sessionId);
        if(Object.keys(this.clientDatas).length == 0){
            this.roomData.timeCount = 0;
            // this.unlock();
        }
    }

    onDispose () {
        logController.LogDev("Dev Dispose StateHandlerRoom");
    }

    checkTime(){
        if(this.roomData.timeCount > 0) return;
        if(this.roomData.gameStatus == game_status.game_end){
            logController.LogDev("Dev Game Start")
            this.lock();
            var message = new Message();
            message.MessageCode = MessageGuessWord.game_start;
            this.roomData.timeCount = timeVar.durationGame;
            this.roomData.gameStatus = game_status.game_start;
            var messageUdRoom = new Message();
            messageUdRoom.MessageCode = MessageGuessWord.update_room;
            messageUdRoom.Data = JSON.stringify(this.roomData);
            this.sendToAllClient(JSON.stringify(message), JSON.stringify(messageUdRoom));
            return;
        }
        if(this.roomData.gameStatus == game_status.game_start){
            logController.LogDev("Dev Time over")
            this.roomData.timeCount = timeVar.delay_time_over;
            this.roomData.gameStatus = game_status.time_over;
            var message = new Message();
            message.MessageCode = MessageGuessWord.time_over;
            message.Data = this.roomConfig.pass;
            var messageUdRoom = new Message();
            messageUdRoom.MessageCode = MessageGuessWord.update_room;
            messageUdRoom.Data = JSON.stringify(this.roomData);
            this.sendToAllClient(JSON.stringify(message), JSON.stringify(messageUdRoom));
            return;
        }
        if(this.roomData.gameStatus == game_status.time_over){
            var message = new Message();
            message.MessageCode = MessageGuessWord.out_room;
            this.sendToAllClient(JSON.stringify(message));
            for(let key in this.clientDatas){
                let value = this.clientDatas[key];
                value.client.leave();
            }
            return;
            // this.roomData.timeCount = timeVar.delayStart;
            // this.roomData.gameStatus = game_status.game_end;
            // var message = new Message();
            // message.MessageCode = MessageGuessWord.game_end;
            // var messageUdRoom = new Message();
            // messageUdRoom.MessageCode = MessageGuessWord.update_room;
            // messageUdRoom.Data = JSON.stringify(this.roomData);
            // this.sendToAllClient(JSON.stringify(message), JSON.stringify(messageUdRoom));
            // this.resetPlayer();
        }

    }

    sendToAllClient(...message: string[]){
        for(let key in this.clientDatas){
            try {
                let value = this.clientDatas[key];
                var messageData = new MessageData(message);
                logController.LogDev("Dev", JSON.stringify(messageData))
                this.sendToClient(JSON.stringify(messageData), value.client);
            } catch (error) {
                logController.LogDev("Dev error:", error)
            }
        }
    }

    sendToClient(data:string, client : Client){
        client.send("message", data);
    }

    resetPlayer(){
        for(let key in this.clientDatas){
            try {
                let value = this.clientDatas[key];
                value.resetData();
            } catch (error) {
                logController.LogDev("Dev error:", error)
            }
        }
        this.state.players.forEach(element => {
            element.resetData()
        });
    }
}