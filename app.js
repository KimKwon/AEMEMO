var express = require('express');
var mongoose = require('mongoose');
var app = express();
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
app.locals.pretty=true;
app.set('views', 'views');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    if (req.query.title) {
      Memo.find({title: new RegExp(req.query.title, "i")}, (err, memos) => {
        res.render('index', {memos: memos});
      })
    }
    else{Memo.find({}, (err, memos) => {
      res.render('index', {memos: memos});
    })}
});

app.get('/:id/delete', (req, res) => {
    Memo.remove({'_id': req.params.id}, (err, output) => {
        res.redirect('/');
    });
});

app.get('/:id/edit', (req, res) => {
    Memo.findOne({'_id': req.params.id}, (err, doc) => {
        res.render('edit', {memo: doc});
    });
});

app.get('/schedular',(req,res)=>{
  res.render('schedule');
});

app.post('/add', (req, res) => {
  var newMemo = new Memo();
    newMemo.title = req.body.title;
    newMemo.body = req.body.body;
    newMemo.save((err) => {
      if(err) console.log(err);
      res.redirect('/');
    });
});

app.get('/edit',(req,res)=>{

});


app.get('/add', (req, res) => {
  res.render('add');
});

app.listen('3000', () => {
  console.log("Good!");
})
