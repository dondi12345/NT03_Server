export class NTDictionary<T>{
    dictionary : { [id: string] : T; } = {};

    constructor(){
        this.dictionary = {}
    }

    Get(key : string){
        return this.dictionary[key];
    }

    Add(key : string, value : T){
        this.dictionary[key] = value;
    }

    Remove(key : string){
        delete this.dictionary[key]
    }

    Count(){
        return Object.keys(this.dictionary).length
    }
}