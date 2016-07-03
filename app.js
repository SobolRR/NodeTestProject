var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var notes = require('./routes/notes');

// var model = require('./models-fs/notes');
// model.connect("./Notes", function (err) {
//   if(err) {
//     throw err;
//   }
// });
// [routes, notes].forEach(function (router) {
//   router.conf({ model: model});
// });

//LevelDb model
// var modelLevelUp = require('./models-levelup/notes');
// modelLevelUp.connect('./chap6', function (err) {
//   if(err) {
//     throw err;
//   }
// });
// [routes, notes].forEach(function (router) {
//   router.conf({model:modelLevelUp});
// });

// sqlite3 model
// var modelSqlite = require('./models-sqlite3/notes');
// modelSqlite.connect('./chap06.sqlite3', function (err) {
//   if(err) throw err;
// });
// [routes, notes].forEach(function (router) {
//   router.conf({model: modelSqlite});
// });

// sequelize model // you can add information about your db
// var modelSeq = require('./models-sequelize/notes');
// modelSeq.connect({
//   dbname: "",
//   username: "",
//   password: "",
//   params: {
//     host: '',
//     dialect: '',
//     storage:'' // we can add path db
//   }
// },
// function (err) {
//   if (err) throw err;
// });
// [routes, notes ].forEach(function (router) {
//   router.conf({ model: modelSeq});
// });

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/noteadd', notes.add);
app.post('/notesave', notes.save);
app.get('/noteview', notes.view);
app.get('/noteedit', notes.edit);
app.get('/notedestroy', notes.destroy);
app.post('/notedodestroy', notes.dodestroy);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
