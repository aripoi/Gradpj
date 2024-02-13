var express = require('express');
var app = express();
var ip = require('ip');
var cors = require('cors');
var session = require('express-session');
app.set('views',__dirname + '/pack/admin/views');
app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
var db = require('./pack/admin/lib/db.js');
var user = require('./pack/admin/lib/user');
var adcon = require('./pack/admin/lib/adminConfig');
var cocktail = require('./pack/admin/lib/cocktail.js');
var mobile = require('./pack/user/mobile.js');
var device = require('./pack/device/device.js');
var man = require('./pack/admin/lib/management.js');
var ipconfig = require('./pack/device/ipcinfig.js');
var status = require('./pack/device/status.js');

var MySqlStore = require('express-mysql-session')(session);
var options = {
    host : 'localhost',
    port: 3306,
    user : 'dbid232',
    password : 'dbpass232',
    database : 'db23205',
};
var sessionStore = new MySqlStore(options);
app.use(express.static(__dirname + '/public/'));
app.use(session({
    secret: 'ANSDUDGNS12!', // 이 키는 나만의 비밀 키로 변경하세요.
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 30 }, // 30분
    store : sessionStore
}));

app.use(cors({
    origin: 'http://localhost:19006' // 여기에 허용하려는 도메인을 추가
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//mobile
app.post('/user/create_process', function(request, response) {
    mobile.create(request, response);
})
app.post('/user/login', function(request, response) {
    mobile.login(request, response);
})
app.post('/user/logout', function(request, response) {
    mobile.logout(request, response);
})
app.post('/user/delete', function(request, response) {
    mobile.delete(request, response);
})
app.post('/user/recommendCocktail', async (request, response) => {
    mobile.chatGpt(request, response)
});
app.post('/user/find-id', function(request, response) {
    mobile.findID(request, response)
});
//비밀번호 찾기
app.post('/user/reset-password', function(request, response) {
    mobile.verifyUser(request, response)
});
//비밀번호 재설정
app.post('/user/makePW', function(request, response) {
    mobile.updatePassword(request, response)
});
app.get('/user/info/:userId', function(request, response) {
    mobile.getUserInfo(request, response);
}); 
app.post('/user/edit_profile', function(request, response) {
    mobile.updateProfile(request, response);
});
app.get('/user/cocktails', function(request, response) {
    mobile.getCocktails(request, response);
  });
app.post('/user/cocktailadd', function(request, response) {
    mobile.getCocktailadd(request, response);
});
app.delete('/user/cocktaildelete/:id', (request, response) => {
    mobile.Cocktaildelete(request, response);
});
app.get('/user/customcocktail', function(request, response) {
    mobile.CustomCocktail(request, response);
})
app.post('/user/get-cocktail-info', function(request, response) {
    mobile.gptcocktailinfo(request, response);
})
app.post('/user/getdevice/:dId', function(request, response) {
    mobile.getdevice(request, response)
})
app.post('/user/feedback', function(request, response) { 
    mobile.feedback(request, response)
}) // 모바일 피드백. (20231121 서명호) 구현필요함
app.post('/user/history', function(request, response) { 
    mobile.history(request, response)
}) // 모바일 이용내역 (20231121 서명호) 구현 중
app.post('/user/deleteHistory', function(request, response) { 
    mobile.deleteHistory(request, response)
}) 
app.get('/user/cocktailranking', function(request, response) {
    mobile.cocktailranking(request, response)
})
app.post('/user/cocktail_count', (request, response) => {
    mobile.cocktailcount(request, response)
})
app.post('/user/uselogadd', (request, response) => {
    mobile.uselogadd(request, response)
})
app.post('/user/horoscope', function(request, response) {
    mobile.horoscope(request, response);
})


//web
app.get('/user/list', function(request, response){
    user.userList(request, response);
})
app.get('/user/listban', function(request, response){
    user.userListBan(request, response);
})
app.get('/user/update_process/:planId', function(request, response){
    user.userUpdate_process(request, response);
})
app.get('/user/delete_process/:planId', function(request, response){
    user.userDelete_process(request, response);
})
app.get('/user/delete_process_ban/:planId', function(request, response){
    user.userDelete_processBan(request, response);
})
app.get('/user/device', function(request, response){
    user.device(request, response);
})
app.get('/user/usehistory', function(request, response) {
    user.history(request, response);
}) //이거 경로 바꿔주세요 모바일이랑 겹침



app.get('/', function(request, response){
    adcon.login(request, response);
});
app.post('/login_process', function(request, response){
    adcon.login_process(request, response);
});
app.get('/logout',function(request, response){
    adcon.logout(request, response);
});
app.get('/changepw', function(request, response){
    adcon.changepw(request, response);
});
app.post('/changepw_process', function(request, response){
    adcon.changepw_process(request, response);
});
app.get('/main', function(request, response){
    adcon.main(request, response);
})


app.get('/cocktail/manage', function(request, response){
    cocktail.manage(request, response);
})
app.get('/cocktail/addition', function(request, response){
    cocktail.addition(request, response);
})
app.get('/cocktail/update/:ctId', function(request, response){
    cocktail.update(request, response);
})
app.post('/cocktail/update_process/:ctId', function(request, response){
    cocktail.update_process(request, response);
})
app.post('/cocktail/addition_process', function(request, response){
    cocktail.addition_process(request, response);
})
app.get('/cocktail/delete_process/:ctId', function(request, response){
    cocktail.delete_process(request, response);
})
app.get('/cocktail/ranking', function(request, response) {
    cocktail.ranking(request, response);
})

app.get('/management/user', function(request, response) {
    man.user(request, response);
})
app.get('/management/errorstat', function(request, response) {
    man.errorstat(request, response);
})
app.get('/management/user/:uId', function(request, response) {
    man.userDetail(request, response);
})
app.get('/management/delete_process/:lId', function(request, response) {
    man.delete(request, response);
})


//ip 주소 주고 받는 uri
app.post('/user/req_ip', function(request, response) {
    ipconfig.user(request, response);
});

app.post('/device/send_ip', function(request, response) {
    ipconfig.device(request, response);
})
//기기상태 데이터
app.post('/user/device_status', function(request, response) {
    status.devstat(request, response);
})
app.post('/device/send_status', function(request, response) {
    status.sendstat(request,response);
})
app.get('/device/showstat', function(request, response) {
    status.showstat(request, response);
})

app.get('/apk/download', function(request, response) {
    adcon.download(request, response)
})


app.get('/device/test', function(request, response){
    device.test(request, response);
})
app.get('/device/makecocktail', function(request, response){
    device.makecocktail(request, response)
})


app.listen(60005, () => 
console.log("접속 주소 : ceprj.gachon.ac.kr:60005/")
)
