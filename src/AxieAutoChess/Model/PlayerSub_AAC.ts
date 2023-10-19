export class PlayerInfo_AAC{
    ID : string;
    SessionId : string;
    Name : string;
    Avata : string;
}

export class PlayerData_AAC{
    SessionId : string;
    gold: number = 0;
    exp: number = 0;
    lv: number = 0;
}

export class ChessData_AAC{
    _id : string;
    Index : number = 0;
    Star : number = 1;
    Slot : number = 0;
    IsUse : boolean = false; 
}

export class PlayerChessData_AAC{
    SessionId : string;
    Chesses : ChessData_AAC[] = [];
}

export class PlayerShopData_AAC{
    SessionId : string;
    Chesses : ChessData_AAC[] = [];
}

export class BuyChessData_AAC{
    SessionId : string;
    ChessId : string;
}
export class SellChessData_AAC{
    SessionId : string;
    ChessId : string;
}