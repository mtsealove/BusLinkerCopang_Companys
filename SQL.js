var mysqlSync = require('sync-mysql');

//연결 정보
var connection = new mysqlSync({
    host: 'localhost',
    user: 'ueue',
    password: 'Fucker0916!',
    port: '3306',
    database: 'BusLinker'
});


//로그인
exports.Login = function (ID, password) {
    var query = `select ID, Name from BusCompany where ID='${ID}' and password='${password}'`;
    var result = connection.query(query)[0];
    return result;
};

//회원 조회
exports.GetMembers = function (CompanyID, key, page) {
    //10개씩 출력
    var start = page * 10;
    var query = `select * from BusDrivers where CompanyID='${CompanyID}'`;
    if (key)
        query += `and name like '%${key}%'`;
    query+=`order by ID desc limit ${start}, 10`;
    var result = connection.query(query);

    return result;
};

//특정 날짜에 운행이 없는 기사의 모든 정보
exports.GetDrivers=function(CompanyID, RunDate, key){
    var query=`select distinct * from BusDrivers 
    where CompanyID='${CompanyID}'
    and ID not in
    (select DriverID from RunInfoEach where RunDate='${RunDate}')`;
    if(key){
        query+=`and (ID like '%${key}%' or Name like '%${key}%')`;
    }
    var result=connection.query(query);
    return result;
}

//회원 페이지 수
exports.GetMembersCount = function (CompanyID) {
    var query = `select count(*) as count from BusDrivers where CompanyID='${CompanyID}'`;
    var count = connection.query(query).count;
    var page = Math.floor(count / 10);
    return page;
};

//운행정보 조회
exports.GetRunInfos=function(CompanyID, key, page){
    var start=page*10;
    var query=`select * from RunInfo where Company='${CompanyID}'`;
    if(key){
        query+=`and Name like '%${key}%'`;
    }
    query+=`order by ID desc limit ${start}, 10`;
    var result=connection.query(query);
    return result;
};

//운행정보 조회 각각
exports.GetRunInfoByID=function(RunInfoID){
    var query=`select * from RunInfo where ID=${RunInfoID}`;
    var result=connection.query(query)[0];
    return result;
};

exports.GetRunInfoCount = function (CompanyID, page) {
    var query = `select count(*) as count from RunInfo where Company='${CompanyID}'`;
    var count = connection.query(query).count;
    var page = Math.floor(count / 10);
    return page;
};

//운행정보 
exports.GetRunInfoEach=function(RunInfoID, RunDate, Company){
    var query=`select bd.ID DriverID, bd.Name DriverName
    from RunInfoEach rie, BusDrivers bd 
    where rie.RunInfoID=${RunInfoID} 
    and rie.RunDate='${RunDate}' 
    and bd.ID=rie.DriverID 
    `;
    var result=connection.query(query);
    return result;
};
//각 운행정보별 기사 등록
exports.InsertRunInfoEach=function(RunInfoID, DriverID, RunDate){
    var resultQuery;
    //이미 존재하는지 확인
    var existQuery=`select count(*) as count 
    from RunInfoEach
    where RunInfoID=${RunInfoID}
    and RunDate='${RunDate}'`;
    var exist=connection.query(existQuery)[0].count;

    if(exist!=0){   //이미 데이터가 존재하면
        //업데이트 쿼리
        resultQuery=`update RunInfoEach 
        set DriverID='${DriverID}' 
        where RunInfoID=${RunInfoID}
        and RunDate='${RunDate}'`;
    }else { //데이터 미 존재 시
        //생성 쿼리
        resultQuery=`insert into RunInfoEach(RunInfoID, Rundate, DriverID) values(${RunInfoID}, '${RunDate}', '${DriverID}')`;
    }
    var result=connection.query(resultQuery);

    var data={
        DriverID:DriverID,
        RunDate: RunDate
    }
    console.log(data);
    return result;
}