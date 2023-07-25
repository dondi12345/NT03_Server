class DateUtils{
    GetCurrentTimeSpan(){
        var d1 = new Date();
        return d1.valueOf()/1000;
    }

    GetCurrentFomatDate(){
        var date = new Date();
        var dd = date.getDate();
        var mm = date.getMonth()+1;
        var yy = date.getFullYear();
        return dd+"/"+mm+"/"+yy;
    }

    GetCurrentDateNumber(){
        var date = new Date();
        var number = date.getFullYear()* 10000;
        number += (date.getMonth()+1) * 100;
        number += date.getDate();
        return number;
    }
}

export const dateUtils = new DateUtils();
