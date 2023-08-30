import { Room, Client, ClientArray, Delayed } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { StateGuessNumber } from "./StateGuessNumber";
import { guessNumberService } from "../Service/GuessNumberService";
import { guessNumberRouter } from "../Router/GuessNumberRouter";
import { DataModel } from "../../../Utils/DataModel";
import { PlayerGuessNumber } from "./PlayerGuessNumber";
import { Message, MessageData } from "../../../MessageServer/Model/Message";
import { MessageGuessNumber } from "./MessageGuessNumber";
import { TransferData } from "../../../TransferData";
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
export class RoomGuessNumberConfig{
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

export class StateGuessNumberRoom extends Room<StateGuessNumber> {
    maxClients = 5;

    clientDatas : ClientDataDictionary
    roomConfig : RoomGuessNumberConfig = new RoomGuessNumberConfig();
    roomData : RoomData = new RoomData();
    delayedInterval!: Delayed;

    onCreate (options) {
        console.log("StateHandlerRoom created!", options);
        this.inti();
        var state = new StateGuessNumber();
        this.clientDatas = {}
        this.setState(state);
        this.onMessage("message", (client, data)=>{
            logController.LogDev("Dev Recive: ", data);
            var message = DataModel.Parse<Message>(data);
            guessNumberRouter.Router(this, message, client.sessionId);
        })
        this.delayedInterval = this.clock.setInterval(() => {
            this.roomData.timeCount--;
            this.checkTime();
        }, 1000);
    }

    inti(){
        this.roomConfig = new RoomGuessNumberConfig();
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
        logController.LogDev("Dev", client.sessionId, "joined!");
        this.state.createPlayer(client.sessionId, options.Name);

        var message = new Message();
        message.MessageCode = MessageGuessNumber.wait_other;
        if(this.roomData.gameStatus == game_status.game_start) message.MessageCode = MessageGuessNumber.game_start;
        if(this.roomData.gameStatus == game_status.time_over) message.MessageCode = MessageGuessNumber.time_over;
        var messageUdRoom = new Message();
        messageUdRoom.MessageCode = MessageGuessNumber.update_room;
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
        if(this.roomData.timeCount <= 0 && this.roomData.gameStatus == game_status.game_end){
            logController.LogDev("Dev Game Start")
            // this.lock();
            var message = new Message();
            message.MessageCode = MessageGuessNumber.game_start;
            this.roomData.timeCount = timeVar.durationGame;
            this.roomData.gameStatus = game_status.game_start;
            var messageUdRoom = new Message();
            messageUdRoom.MessageCode = MessageGuessNumber.update_room;
            messageUdRoom.Data = JSON.stringify(this.roomData);
            this.sendToAllClient(JSON.stringify(message), JSON.stringify(messageUdRoom));
        }
        if(this.roomData.timeCount <= 0 && this.roomData.gameStatus == game_status.game_start){
            logController.LogDev("Dev Time over")
            this.roomData.timeCount = timeVar.delay_time_over;
            this.roomData.gameStatus = game_status.time_over;
            var message = new Message();
            message.MessageCode = MessageGuessNumber.time_over;
            var messageUdRoom = new Message();
            messageUdRoom.MessageCode = MessageGuessNumber.update_room;
            messageUdRoom.Data = JSON.stringify(this.roomData);
            this.sendToAllClient(JSON.stringify(message), JSON.stringify(messageUdRoom));
        }
        if(this.roomData.timeCount <= 0 && this.roomData.gameStatus == game_status.time_over){
            var message = new Message();
            message.MessageCode = MessageGuessNumber.out_room;
            this.sendToAllClient(JSON.stringify(message));
            for(let key in this.clientDatas){
                let value = this.clientDatas[key];
                value.client.leave();
            }
            return;
            // this.roomData.timeCount = timeVar.delayStart;
            // this.roomData.gameStatus = game_status.game_end;
            // var message = new Message();
            // message.MessageCode = MessageGuessNumber.game_end;
            // var messageUdRoom = new Message();
            // messageUdRoom.MessageCode = MessageGuessNumber.update_room;
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