import { Room, Client, ClientArray, Delayed } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { StateGuessNumber } from "./StateGuessNumber";
import { guessNumberService } from "../GuessNumberService";
import { guessNumberRouter } from "../Router/GuessNumberRouter";
import { DataModel } from "../../../Utils/DataModel";
import { Message, MessageCode } from "./Message";
import { PlayerGuessNumber } from "./PlayerGuessNumber";

export class ClientData{
    client : Client;
    hisAnswer : string [] = [];
    hisResult : string [] = [];

    resetData(){
        this.hisAnswer = [];
        this.hisResult = [];
    }
}
export type DataHeroDictionary = Record<string, ClientData>;
export class RoomGuessNumberData{
    pass : string;
    legthPass : number;
    maxAnswers : number;
}

const timeVar = {
    delayStart : 10,
    durationGame : 60,
    delay_time_over : 10,
}

const game_status = {
    game_start : 1,
    game_end : 0,
    time_over : 2,
}

export class StateGuessNumberRoom extends Room<StateGuessNumber> {
    maxClients = 2;

    clientDatas : DataHeroDictionary
    roomData : RoomGuessNumberData;
    delayedInterval!: Delayed;

    onCreate (options) {
        console.log("StateHandlerRoom created!", options);
        this.inti();
        var state = new StateGuessNumber();
        this.clientDatas = {}
        this.setState(state);
        this.onMessage("message", (client, data)=>{
            console.log("Recive: ", data);
            var message = DataModel.Parse<Message>(data);
            guessNumberRouter.Router(this, message, client.sessionId);
        })
        this.delayedInterval = this.clock.setInterval(() => {
            this.state.room.timeCount++;
            this.checkTime();
        }, 1000);
    }

    sendClientDataToClient(sessionId){
        var clientData = this.clientDatas[sessionId];
        console.log(clientData);
        clientData.client.send("getData", JSON.stringify(clientData));
    }

    inti(){
        this.roomData = new RoomGuessNumberData();
        this.roomData.legthPass = 4;
        this.roomData.maxAnswers = 5;
        this.resetData();
    }

    resetData(){
        this.roomData.pass = "";
        switch (this.roomData.legthPass) {
            default:
                this.roomData.pass = guessNumberService.fourWord[Math.floor(Math.random()*guessNumberService.fourWord.length)];
                break;
        }
        console.log("Pass: ", this.roomData.pass);
    }
    
    onJoin (client: Client, options) {
        var clientData = new ClientData();
        clientData.client = client;
        this.clientDatas[client.sessionId] = clientData;
        console.log(client.sessionId, "joined!");
        this.state.createPlayer(client.sessionId);
    }

    onLeave (client) {
        console.log(client.sessionId, "left!");
        try {
            delete this.clientDatas[client.sessionId]
        } catch (error) {
            console.log("error: ", error);
        }
        this.state.removePlayer(client.sessionId);
    }

    onDispose () {
        console.log("Dispose StateHandlerRoom");
    }

    checkTime(){
        if(this.state.room.timeCount >= timeVar.delayStart && this.state.room.gameStatus == game_status.game_end){
            console.log("Game Start")
            var message = new Message();
            message.MessageCode = MessageCode.game_start;
            this.state.room.timeCount = 0;
            this.state.room.gameStatus = game_status.game_start;
            this.sendToAllClient(message);
        }
        if(this.state.room.timeCount>= timeVar.durationGame && this.state.room.gameStatus == game_status.game_start){
            console.log("Time over")
            this.state.room.timeCount = 0;
            this.state.room.gameStatus = game_status.time_over;
            var message = new Message();
            message.MessageCode = MessageCode.time_over;
            this.sendToAllClient(message);
        }
        if(this.state.room.timeCount >= timeVar.delay_time_over && this.state.room.gameStatus == game_status.time_over){
            var message = new Message();
            message.MessageCode = MessageCode.game_end;
            this.sendToAllClient(message);
            this.state.room.timeCount = 0;
            this.state.room.gameStatus = game_status.game_end;
            this.resetPlayer();
        }
        
    }

    sendToAllClient(message : Message){
        for(let key in this.clientDatas){
            try {
                let value = this.clientDatas[key];
                value.client.send("message", JSON.stringify(message));
            } catch (error) {
                console.log("error:", error)
            }
        }
    }

    resetPlayer(){
        for(let key in this.clientDatas){
            try {
                let value = this.clientDatas[key];
                value.resetData();
            } catch (error) {
                console.log("error:", error)
            }
        }
        this.state.players.forEach(element => {
            element.resetData()
        });
    }
}