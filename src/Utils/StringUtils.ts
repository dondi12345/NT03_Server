class StringUtils {
    StringRepalce(str : string, index : number, char : string){
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
}

export const stringUtils = new StringUtils();