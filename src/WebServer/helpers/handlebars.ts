module.exports ={
    equal: (a: any,b: any) =>{
        if(a==b){
            return true;
        }else{
            return false;
        }
    },

    more : (a:any,b:any) =>{
        let f = parseInt(a);
        let s = parseInt(b);
        if(f>s){
            return true;
        }else{
            return false;
        }
    },

    mod: (a:any,b:any)=>{
        let f = parseInt(a);
        let s = parseInt(b);
        if(f%s==0){
            return true;
        }else{
            return false;
        }

    },

    diff: (a:any) =>{
        if(a){
            return false
        }else{
            return true
        }
    },
    
    sum: (a:any,b:any) => {
        let sum = parseInt(a) + parseInt(b);
        return sum;
    },

    multi: (a:any,b:any) => a*b,
}

import Handlebars from 'handlebars';

export const func = Handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for(var index = 0; index < n; ++index)
        accum += block.fn(index);
    return accum;
});