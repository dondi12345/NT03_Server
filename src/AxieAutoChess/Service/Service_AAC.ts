import { NTDictionary } from "../../Utils/NTDictionary";
import { dataChess } from "../Config/DataChess_AAC";
import { Chess_AAC } from "../Model/Chess_AAC";

class Service_AAC{
    chessDataDic : NTDictionary<Chess_AAC>;

    constructor(){
        this.Init();
    }

    Init(){
        this.chessDataDic = new NTDictionary<Chess_AAC>(); 
        dataChess.forEach(element => {
            this.chessDataDic.Add(element.Index.toString(), element);
        });
    }
}

export const service_AAC = new Service_AAC();