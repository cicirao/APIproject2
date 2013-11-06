//Module requirements
var express = require('express')
var tw = require('./tw')

//Create app
var app = express();

//Configuration
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('view options', { layout: false });
//Routes
app.get('/', function(req, res) {
  // TODO: replace it
	res.render('index');
});
app.get('/fb/content*', function (req, res) {
	res.render('content');
});

app.get('/tw', function (req, res) {
  tw.requestToken(req, res)
});
app.get('/tw/content*', function (req, res) {
  tw.requestAccess(req, res)
});

//Listen
app.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');
