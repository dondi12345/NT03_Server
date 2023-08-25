import { Room, Client, ClientArray } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { PlayerGuessNumber } from "./PlayerGuessNumber";
import { RoomGuessNumberData } from "./StateHandler";

const Ans = {
    correct : "2",
    correctNumber : "1",
    wrong :  "0"
}

const StatusPlayer = {
    Lose : -1,
    Do : 0,
    Win : 1,
}


export class StateGuessNumber extends Schema{
    @type({ map: PlayerGuessNumber })
    players = new MapSchema<PlayerGuessNumber>();

    something = "This attribute won't be sent to the client-side";

    createPlayer(sessionId: string) {
        this.players.set(sessionId, new PlayerGuessNumber());
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }

    playerAnswer (sessionId: string, answer : string = "", roomGuessNumberData : RoomGuessNumberData) {
        var player = this.players.get(sessionId);
        var checkAns = "";
        if(player == null || player == undefined){
            console.log("Not found: "+sessionId)
        }else{
            if(player.numb > roomGuessNumberData.legthPass){
                console.log("Not turn")
                return;
            };
            if(answer.length <4){
                console.log("Inval")
                return;
            }
            var checkAns = "";
            for (let i = 0; i < answer.length; i++) {
                var check = "0"
                for (let j = 0; j < roomGuessNumberData.pass.length; j++) {
                    if(answer[i] == roomGuessNumberData.pass[j]){
                        if(i==j){
                            check="2";
                        }else{
                            check="1";
                        }
                        break;
                    }else{
                        check = "0";
                    }
                }
                checkAns+=check;
            }
            if(player.correct.length == 0){
                var wrongAns = "";
                for (let index = 0; index < roomGuessNumberData.legthPass; index++) {
                    wrongAns += Ans.wrong;
                }
                player.correct = wrongAns
            }
            for (let i = 0; i < checkAns.length; i++) {
                if(checkAns[i] == Ans.wrong || player.correct[i] == Ans.correct){

                }else{
                    if(checkAns[i]==Ans.correct){
                        player.correct = StringRepalce(player.correct, i, Ans.correct);
                        player.score+=10;
                    }
                }
            }
            player.numb++;
            var correctAns = "";
            for (let index = 0; index < roomGuessNumberData.legthPass; index++) {
                correctAns += Ans.correct;
            }
            if(checkAns == "2222"){
                player.status = StatusPlayer.Win;
                console.log("Win")
            }else if(player.numb >= roomGuessNumberData.legthPass){
                player.status = StatusPlayer.Lose;
            };
        }
    }
}

function StringRepalce(str : string, index : number, char : string){
    var newChar = "";
    for (let i = 0; i < str.length; i++) {
        if(i==index){
            newChar+=char;
        }else{
            newChar+=str[i];
        }
        
    }
    return newChar;
}