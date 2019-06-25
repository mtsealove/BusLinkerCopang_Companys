var mysql = require('./SQL');
function InitCalendar(year, month) {   //7x5배열 생성
    var dates = [];
    var week = [];
    var firstDay = new Date(year + '-' + month + '-01').getDay();  //첫째 날
    var d = 0;

    //첫 번째 주
    for (var i = 0; i < firstDay; i++) {
        week.push('');
    }
    var last0 = week.length;
    for (var i = 0; i < 7 - last0; i++) {
        d++;
        week.push(d);
    }
    dates.push(week);

    var max = MaxDay(year, month);
    for (var i = 0; i < 5; i++) {
        week = [];
        for (var j = 0; j < 7; j++) {
            d++;
            if (d > max) {
                break;;
            }
            week.push(d);
        }
        var last = week.length;
        for (var j = 0; j < 7 - last; j++) {
            week.push('');
        }

        dates.push(week);
    }

    return dates;
}

function MaxDay(year, month) {  //각 달의 최대 일수 반환
    var result;
    switch (month) {
        case 1:
            result = 31;
            break;
        case 2:
            if (year % 4 == 0 && year % 100 == 0 || year % 400 == 0)    //윤년 계산
                result = 29;
            else result = 28;
            break;
        case 3:
            result = 31;
            break;
        case 4:
            result = 30;
            break;
        case 5:
            result = 31;
            break;
        case 6:
            result = 30;
            break;
        case 7:
            result = 31;
            break;
        case 8:
            result = 31;
            break;
        case 9:
            result = 30;
            break;
        case 10:
            result = 31;
            break;
        case 11:
            result = 30;
            break;
        case 12:
            result = 31;
            break;
        default:
            result = 31;
    }
    return result;
}

exports.GetFullCalendar = function (RunInfoID, year, month, company) {
    var EventDate = null;
    var result = [];
    var dates = InitCalendar(year, month);    //달력 초기화
    for (var i = 0; i < 6; i++) {
        var week = [];
        for (var j = 0; j < 7; j++) {
            EventDate = null;
            if (dates[i][j] != '') {   //날짜가 비어있지 않다면
                var RunDate = year + '-' + month + '-' + dates[i][j];
                try {
                    //해당 날짜의 운행자
                    EventDate = { //JSon형식으로 저장
                        date: dates[i][j],
                        DriverID: mysql.GetRunInfoEach(RunInfoID, RunDate, company)[0].DriverID,
                        DriverName: mysql.GetRunInfoEach(RunInfoID, RunDate, company)[0].DriverName
                    };
                } catch (error) {
                    EventDate = {
                        date: dates[i][j],
                    };
                }
            } else{
                EventDate={
                    date:''
                }
            }
            week.push(EventDate);
        }
        var add=false;
        for(var j=0; j<7; j++){ 
            if(week[j]) //하나만이라도 null이 아니면
                add=true;
        }
        if(add)
            result.push(week);
    }

    console.log(result);
    return result;
}