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
}

export const dateUtils = new DateUtils();
