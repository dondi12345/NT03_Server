class EnumUtils{
    ToString(kind:any ,value: any){
        return kind[value];
    }
    ToNumber(value: any){
        return value;
    }
}

export const enumUtils = new EnumUtils();