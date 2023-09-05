import { Room, Client, Delayed } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import {  StateSpellingBee } from "./StateSpellingBee";
import { DataModel } from "../../../Utils/DataModel";
import { Message, MessageData } from "../../../MessageServer/Model/Message";
import { logController } from "../../../LogServer/Controller/LogController";
import { spellingBeeRouter } from "../Router/SpellingBeeRouter";
import { MessageSpellingBee } from "./MessageSpellingBee";
import { readFileSync, writeFileSync } from 'fs';
import { rootDir } from '../../../..';
import path from 'path';

export class ClientDataSpellingBee{
    client : Client;
    hisAnswer : string [] = [];

    resetData(){
        this.hisAnswer = [];
    }
}
export type ClientDataSpellingBeeDictionary = Record<string, ClientDataSpellingBee>;
export class RoomSpellingBeeConfig{
    words : string[] = [];
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

export class RoomSpellingBeeData{
    timeCount : number = 0;
    sub : string[] = [];
    gameStatus : number = 0;
}
const LINE_EXPRESSION: RegExp = /\r\n|\n\r|\n|\r/g;

export class StateSpellingBeeRoom extends Room<StateSpellingBee> {
    maxClients = 5;

    clientDatas : ClientDataSpellingBeeDictionary
    roomConfig : RoomSpellingBeeConfig = new RoomSpellingBeeConfig();
    roomData : RoomSpellingBeeData = new RoomSpellingBeeData();
    delayedInterval!: Delayed;

    onCreate (options) {
        console.log("SpellingBeeRoom created!", options);
        this.inti();
        var state = new StateSpellingBee();
        this.clientDatas = {}
        this.setState(state);
        this.onMessage("message", (client, data)=>{
            logController.LogDev("Dev Recive: ", data);
            var message = DataModel.Parse<Message>(data);
            spellingBeeRouter.Router(this, message, client.sessionId);
        })
        this.delayedInterval = this.clock.setInterval(() => {
            this.roomData.timeCount--;
            this.checkTime();
        }, 1000);
    }

    inti(){
        this.roomConfig = new RoomSpellingBeeConfig();
        this.roomData = new RoomSpellingBeeData();
        this.roomData.timeCount = timeVar.delayStart;
        this.resetData();
    }
    
    resetData(){
        const result = readFileSync(path.join(rootDir+ '/public/resources/guess_word/enwords.txt'), 'utf-8');
        var words = result.split(`\n`);
        for(let round = 0; round < 10000; round++){
            this.roomConfig.words = [];
            this.roomData.sub = [];
            var index = 0;
            var index_1 = 0;
            var keys ="qwrtypsdfghjklzxcvbnm";
            var keysub = "ueoai";
            for(let i = 0; i < 5; i++){
                let index = Math.floor(Math.random()*keys.length);
                this.roomData.sub.push(keys[index]);
                keys = keys.replace(keys[index],"");
            }
            for(let i = 0; i < 2; i++){
                let index = Math.floor(Math.random()*keysub.length);
                this.roomData.sub.push(keysub[index]);
                keysub = keysub.replace(keysub[index],"");
            }
            words.forEach(element => {
                element = element.toLowerCase( )
                element = element.replace(LINE_EXPRESSION, '')
                var same = false;
                for (let index = 0; index < element.length; index++) {
                    if(element[index].toString()==  this.roomData.sub[0]){
                        same = true;
                        break;
                    }
                }
                if(same == true){
                    var done = true;
                    for (let index = 0; index < element.length; index++) {
                        var same_1 = false;
                        for (let i = 0; i <  this.roomData.sub.length; i++) {
                            if(element[index].toString()==  this.roomData.sub[i]){
                                same_1 = true;
                                break;
                            }   
                        }
                        if(same_1 == false){
                            done = false;
                            break;
                        }
                    }
                    if(done == true){
                        this.roomConfig.words.push(element);
                        index++;
                        if(element.length < 6){
                            index_1++;
                        }
                    }
                }
            });
            if(index_1 >=75){
                break;
            }
        }
        console.log( this.roomData.sub, this.roomConfig.words.length);
    }

    onJoin (client: Client, options) {
        logController.LogDev("Dev", options);
        var clientData = new ClientDataSpellingBee();
        clientData.client = client;
        this.clientDatas[client.sessionId] = clientData;
        logController.LogDev("Dev", options.Name, client.sessionId, "joined!");
        this.state.createPlayer(client.sessionId, options.Name);

        var message = new Message();
        message.MessageCode = MessageSpellingBee.wait_other;
        if(this.roomData.gameStatus == game_status.game_start) message.MessageCode = MessageSpellingBee.game_start;
        if(this.roomData.gameStatus == game_status.time_over) message.MessageCode = MessageSpellingBee.time_over;
        var messageUdRoom = new Message();
        messageUdRoom.MessageCode = MessageSpellingBee.update_room;
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
            message.MessageCode = MessageSpellingBee.game_start;
            this.roomData.timeCount = timeVar.durationGame;
            this.roomData.gameStatus = game_status.game_start;
            var messageUdRoom = new Message();
            messageUdRoom.MessageCode = MessageSpellingBee.update_room;
            messageUdRoom.Data = JSON.stringify(this.roomData);
            this.sendToAllClient(JSON.stringify(message), JSON.stringify(messageUdRoom));
            return;
        }
        if(this.roomData.gameStatus == game_status.game_start){
            logController.LogDev("Dev Time over")
            this.roomData.timeCount = timeVar.delay_time_over;
            this.roomData.gameStatus = game_status.time_over;
            var message = new Message();
            message.MessageCode = MessageSpellingBee.time_over;
            var messageUdRoom = new Message();
            messageUdRoom.MessageCode = MessageSpellingBee.update_room;
            messageUdRoom.Data = JSON.stringify(this.roomData);
            this.sendToAllClient(JSON.stringify(message), JSON.stringify(messageUdRoom));
            return;
        }
        if(this.roomData.gameStatus == game_status.time_over){
            var message = new Message();
            message.MessageCode = MessageSpellingBee.out_room;
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