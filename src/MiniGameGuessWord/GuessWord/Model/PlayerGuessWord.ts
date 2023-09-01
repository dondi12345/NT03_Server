import { Schema, Context } from "@colyseus/schema";
const type = Context.create(); // this is your @type() decorator bound to a context
export class PlayerGuessWord extends Schema{
    @type("string")
    playerName : string = "";
    @type("string")
    correct : string = "";
    @type("number")
    numb : number = 0;
    @type("number")
    score : number = 0;
    @type("number")
    status : number = 0;

    resetData(){
        this.correct = "";
        this.numb = 0;
        this.score = 0;
        this.status = 0;
    }
}
