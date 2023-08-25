
export class Message{
    MessageCode: string;                              
    Data: any;
    Token : string;
    constructor() {
        
    }
}

export const MessageCode = {
    player_answer : "guess_number/player_answer",
    result_answer : "guess_number/result_answer",
    player_lose : "guess_number/player_lose",
    player_win : "guess_number/player_win",
}