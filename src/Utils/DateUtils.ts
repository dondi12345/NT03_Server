class DateUtils{
    // 1691209954
    GetCurrentTimeSpan(){
        var d1 = new Date();
        return d1.valueOf()/1000;
    }

    // 5/8/2023
    GetCurrentFomatDate(){
        var date = new Date();
        var dd = date.getDate();
        var mm = date.getMonth()+1;
        var yy = date.getFullYear();
        return dd+"/"+mm+"/"+yy;
    }

    // 20230805
    GetCurrentDateNumber(){
        var date = new Date();
        var number = date.getFullYear()* 10000;
        number += (date.getMonth()+1) * 100;
        number += date.getDate();
        return number;
    }

    DayToSecond(day:number){
        return day*24*60*60;
    }
}

export const dateUtils = new DateUtils();
