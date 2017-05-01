var express = require('express');
var mongoose = require('mongoose');
var noteapp = express();
var bodyParser = require('body-parser');

mongoose.connect('mongodb://joon:1234@ds153730.mlab.com:53730/mern');

var connection = mongoose.connection;

var Schema = mongoose.Schema;

var MemoSchema = new Schema({
    title     : String,
    body      : String,
    date    : {type: Date, default:Date.now}
});

var Memo = mongoose.model('kkmemo', MemoSchema);
noteapp.locals.pretty=true;
noteapp.set('views', 'views');
noteapp.set('view engine', 'jade');
noteapp.use(bodyParser.json());
noteapp.use(bodyParser.urlencoded({ extended: false }));
noteapp.use(express.static('public'));

noteapp.get('/', (req, res) => {
    if (req.query.title) {
      Memo.find({title: new RegExp(req.query.title, "i")}, (err, memos) => {
        res.render('index', {memos: memos});
      })
    }
    else{Memo.find({}, (err, memos) => {
      res.render('index', {memos: memos});
    })}
})

noteapp.post('/add', (req, res) => {
  var newMemo = new Memo();
    newMemo.title = req.body.title;
    newMemo.body = req.body.body;
    newMemo.save((err) => {
      if(err) console.log(err);
      res.redirect('/');
    });
});

noteapp.get('/:id/delete', (req, res) => {
    Memo.remove({'_id': req.params.id}, (err, output) => {
        res.redirect('/');
    });
});


noteapp.get('/schedular',(req,res)=>{
  res.render('schedule');
});
noteapp.get('/:id/edit', (req, res) => {
    Memo.findOne({'_id': req.params.id}, (err, doc) => {
        res.render('edit', {memo: doc});
    });
});


noteapp.get('/add', (req, res) => {
  res.render('add');
});

noteapp.listen('3000', () => {
  console.log("Good!");
})


const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

// 윈도우 객체를 전역에 유지합니다. 만약 이렇게 하지 않으면
// 자바스크립트 GC가 일어날 때 창이 멋대로 닫혀버립니다.
let win

function createWindow () {
  // 새로운 브라우저 창을 생성합니다.
  win = new BrowserWindow({width: 800, height: 600})

  // 그리고 현재 디렉터리의 index.html을 로드합니다.
  win.loadURL(url.format({
    pathname: 'localhost:3000',
    protocol: 'http:',
    slashes: true
  }))

  // 개발자 도구를 엽니다.
  // win.webContents.openDevTools()

  // 창이 닫히면 호출됩니다.
  win.on('closed', () => {
    // 윈도우 객체의 참조를 삭제합니다. 보통 멀티 윈도우 지원을 위해
    // 윈도우 객체를 배열에 저장하는 경우가 있는데 이 경우
    // 해당하는 모든 윈도우 객체의 참조를 삭제해 주어야 합니다.
    win = null
  })
}

// 이 메서드는 Electron의 초기화가 끝나면 실행되며 브라우저
// 윈도우를 생성할 수 있습니다. 몇몇 API는 이 이벤트 이후에만
// 사용할 수 있습니다.
app.on('ready', createWindow)

// 모든 창이 닫히면 애플리케이션 종료.
app.on('window-all-closed', () => {
  // macOS의 대부분의 애플리케이션은 유저가 Cmd + Q 커맨드로 확실하게
  // 종료하기 전까지 메뉴바에 남아 계속 실행됩니다.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // macOS에선 보통 독 아이콘이 클릭되고 나서도
  // 열린 윈도우가 없으면, 새로운 윈도우를 다시 만듭니다.
  if (win === null) {
    createWindow()
  }
})

// 이 파일엔 제작할 애플리케이션에 특화된 메인 프로세스 코드를
// 포함할 수 있습니다. 또한 파일을 분리하여 require하는 방법으로
// 코드를 작성할 수도 있습니다.
