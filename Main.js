var express = require('express');
var session = require('express-session');
var bodeParser = require('body-parser');
var app = express();
var fs = require('fs');
var mysql = require('./SQL');
var calendar = require('./Calendar');

app.use('/Scripts', express.static(__dirname + '/Scripts'));  //자바 스크립트 사용 폴더
app.set('view engine', 'ejs');
app.set('views', './Views');
app.use(bodeParser.urlencoded({ extended: true }));
app.use(session({
    key: 'sid',
    secret: 'secret',
    resave: 'false',
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 10  //로그인 유지 시간(10시간)
    }
}));

//로고 이미지 라우팅
app.get('/logo', function (req, res) {
    fs.readFile('./Views/Src/logo.png', function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

//로그인 페이지 출력
app.get('/Login', function (req, res) {
    if (req.session.userID)
        res.redirect('/Members');
    else
        res.render('Login', { 'title': '로그인' });
});

//로그인 post
app.post('/Login', function (req, res) {
    var body = req.body;
    var userID = body['UserID'];
    var userPassword = body['UserPassword'];

    var result = mysql.Login(userID, userPassword);
    if (result == null) {
        res.send('<script>alert("ID와 비밀번호를 확인하세요"); history.go(-1)</script>');
    } else {
        console.log(result.ID);
        console.log(result.Name);
        req.session.userID = result.ID;
        res.redirect(`/Members`);
    }
});

//로그아웃
app.get('/Logout', function (req, res) {
    req.session.destroy();
    res.send('<script>alert("로그아웃되었습니다");  location.href="/Login"</script>');
});
var PrimaryColor = '#007bff'; //메인 색상
var BlackColor = '#000000'; //검은 색상

//회원조회
app.get('/Members', function (req, res) {
    var page = req.query.page;
    var keyword = req.query.keyword;
    if (page == null)
        page = 0;

    if (req.session.userID) {
        var Content = mysql.GetMembers(req.session.userID, keyword, page);
        var totalPage = mysql.GetMembersCount(req.session.userID);
        res.render('Members', { 'title': '회원조회', 'ColorMembers': PrimaryColor, 'ColorInfo': BlackColor, 'TableContent': Content, 'totalpage': totalPage });
    } else {
        res.send('<script>alert("로그인이 필요한 페이지입니다.");location.href="/Login"</script>');
    }
});

//운행정보 조회
app.get('/RunInfo', function (req, res) {
    var keyword = req.query.keyword;
    var page = req.query.page;

    if (page == null) {
        page = 0;
    }
    if (req.session.userID) {
        var Content = mysql.GetRunInfos(req.session.userID, keyword, page);
        var totalPage = mysql.GetRunInfoCount(req.session.userID);
        res.render('RunInfo', { 'title': '운행정보', 'ColorMembers': BlackColor, 'ColorInfo': PrimaryColor, 'TableContent': Content, 'totalpage': totalPage });

    } else {
        res.send('<script>alert("로그인이 필요한 페이지입니다.");location.href="/Login"</script>');
    }
});

//운행정보 조회 상세 및 각 날짜 등록
app.get('/RunInfoEach', function (req, res) {
    var RunInfoID = req.query.RunInfoID;  //운행정보 ID
    var TableContent = mysql.GetRunInfoByID(RunInfoID);
    var month=req.query.Month;  //달
    console.log(month);
    
    if(month==null)
        month= new Date().getMonth() + 1;

    var year = new Date().getUTCFullYear();
    var CalendarArray = calendar.GetFullCalendar(RunInfoID, year, month, req.session.userID); //달력 배열

    res.render('RunInfoEach', { 'title': '운행정보', 'ColorMembers': BlackColor, 'ColorInfo': PrimaryColor, 'TableContent': TableContent, 'Month': month, 'Calendar': CalendarArray, 'RunInfoID': RunInfoID });
});

//운행정보 업데이트
app.post('/RunInfoEach', function (req, res) {
    var RunInfoID = req.body['RunInfoID'];
    var newDatas = [];
    for (var i = 0; i < 100; i++) {  //데이터 추가
        if (req.body['DriverID' + i]) {
            var data = {
                DriverID: req.body['DriverID' + i],
                RunDate: req.body['RunDate' + i]
            }
            newDatas.push(data);
        } else break;   //데이터가 없으면 종료
    }
    //받은 데이터를 DB에 저장
    for(var i=0; i<newDatas.length; i++){
        mysql.InsertRunInfoEach(RunInfoID, newDatas[i].DriverID, newDatas[i].RunDate);  //데이터 삽입
    }

    //알림후 페이지 리디렉트
    res.send(`<script>alert("정보가 등록되었습니다");location.href="/RunInfoEach?RunInfoID=${RunInfoID}"</script>`);
});


//각 버스 기사 선택
app.get('/SelectDriver', function (req, res) {
    var key = req.query.key;  //검색어
    var RunDate = req.query.RunDate;  //운행일
    var RunInfoID = req.query.RunInfoID;
    var Contents = mysql.GetDrivers(req.session.userID, RunDate, key);
    console.log(Contents);

    res.render('SelectDriver', { 'title': '기사 선택', 'Contents': Contents, 'RunInfoID': RunInfoID, 'RunDate': RunDate });
});

app.listen(3000, function () {
    console.log('버스사 클라이언트 실행');
});