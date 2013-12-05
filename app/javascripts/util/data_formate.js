define(['exports'],function(exports){
    var min = 60 * 1000,
        hour = 60 * min,
        day = 24 * hour,
        day2 = 2 * day,
        year = 365 * day;
        
    exports.time2current = function(dt){
        var date = new Date(dt),
            now = new Date(),
            disc =  now - date;

        if(disc < day){
            return date.getHours() + ':' + date.getMinutes();
        }else if(disc < day2){
            return '昨天';
        }else if(disc < year){
            return (date.getUTCMonth() + 1) + '/' + date.getDate() + '/';
        }else{
            return date.getFullYear() + '/' + (date.getUTCMonth() + 1) + '/' + date.getDate() + '/';
        }
    };

    exports.date2current = function(dt){
        var date = new Date(dt),
            now = new Date(),
            disc =  now - date;

        if(disc < day){
            return '今天';
        }else if(disc < day2){
            return '昨天';
        }else if(disc < year){
            return (date.getUTCMonth() + 1) + '月' + date.getDate() + '日';
        }else{
            return date.getFullYear() + '年' + (date.getUTCMonth() + 1) + '月' + date.getDate() + '日';
        }
    };
});
