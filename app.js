var express = require('express'),
	passport = require('passport'),
	util = require('util'),
	path = require('path'),
	http = require('http'),
	oa,
	oa2,
	FacebookStrategy = require('passport-facebook').Strategy,
	TwitterStrategy = require('passport-twitter').Strategy,
	user = { id: "abc"},
	User = { id: "cba"};

var FACEBOOK_APP_ID = "184163791771170";
var FACEBOOK_APP_SECRET = "5ca092b4ca6a2265c1842c36bf2eb64c";
var TWITTER_CONSUMER_KEY = "EtXcMyqnlDgvruH85NKsw";
var TWITTER_CONSUMER_SECRET = "gFJ7ST2USrrxF6yZwpkE1CmZaZONJ5cFdo1vg2q2ALQ";

function initTwitterOauth() {
	var OAuth = require('oauth').OAuth;
	oa = new OAuth(
	  "https://twitter.com/oauth/request_token",
	  "https://twitter.com/oauth/access_token",
	  TWITTER_CONSUMER_KEY,
	 	TWITTER_CONSUMER_SECRET,
	 	"1.0A",
  	"http://127.0.0.1:3000/auth/twitter/callback",
	 	"HMAC-SHA1"
  );
}

function initFacebookOauth() {
	var OAuth2 = require('oauth/lib/oauth2').OAuth2;
	oa2 = new OAuth2(
		FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    'https://graph.facebook.com/',
    'oauth/authorize',
    'oauth/access_token',
    null
  );
  oa2.getOAuthAccessToken(
    '',
    {'grant_type':'client_credentials'},
    function (e, access_token, refresh_token, results){
      console.log('bearer: ',access_token);
      done();
    }
  );
}

function getFacebook(user, method, cb) {
	oa2.get(
		"https://graph.facebook.com" + method,
		User.accessToken,
		function(err,data){
      if(err){
        console.log(err);
        cb(err);
      } else {
        cb(JSON.parse(data));
      }
    }
	);
}

//这个获取tweet的函数不会写，得不到json,也输出不了名字、描述、时间、来自t还是f
function getTweet(user, method, cb) {
	oa.get(
		"https://api.twitter.com/1.1" + method,
		user.token,
		user.tokenSecret,
		function(err,data){
      if(err){
        console.log(err);
        cb(err);
      } else {
        cb(JSON.parse(data));
      }
    }
	);
}

//Passport session setup.
passport.serializeUser(function(_user, done) {
	user.id = Math.random().toString();
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	done(null, user);
});

passport.serializeUser(function(_User, done) {
	User.id = Math.random().toString();
	done(null, User.id);
});

passport.deserializeUser(function(id, done) {
	done(null, User);
});


//Use the FacebookStrategy within Passport.
passport.use(new FacebookStrategy({
		clientID: FACEBOOK_APP_ID,
		clientSecret: FACEBOOK_APP_SECRET,
		callbackURL: "http://localhost:3000/auth/facebook/callback"
	},
	function(accessToken, refreshToken, profile, done) {
    User.accessToken = accessToken;
    User.refreshToken = refreshToken;
    User.profile = profile;
    initFacebookOauth();
    done(null, User);
	}
));

//Use the TwitterStrategy within Passport.
passport.use(new TwitterStrategy({
		consumerKey: TWITTER_CONSUMER_KEY,
		consumerSecret: TWITTER_CONSUMER_SECRET,
		callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
	},
	function(token, tokenSecret, profile, done) {
    user.token = token;
    user.tokenSecret = tokenSecret;
    user.profile = profile;
    initTwitterOauth();
    done(null, user);
	}
));


var app = express();

//configure express
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session( { secret: 'keyboard cat'}));
	//Initial passport. Use passport.session() middleware to support
	//persistent login sessions
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));/*
	app.use(passport.use('twi'));*/
});


app.get('/', function(req, res){
  res.render('login', { user: req.user });
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next(null); }
	else
		console.log("err!");
}

app.get('/content', function(req, res){
	res.render('content', { user: req.user });
});

app.get('/api/*', function(req, res) {
  console.log(req)
  var query = req.url.replace('/api', '')
  getTweet(req.user, query, function(tweetRes) {
    res.send(tweetRes)
  })
  /*getFacebook(req.user, query, function(facebookRes) {
  	res.send(facebookRes)
  })*/
})

//GET /auth/facebook
app.get('/auth/facebook', passport.authenticate('facebook'));

//GET /auth/facebook/callback
app.get('/auth/facebook/callback',
	passport.authenticate('facebook', { 
		failureRedirect: '/login' 
  }),
	function(req, res) {
		console.log(req)
  	res.redirect('/content');
});


//GET /auth/twitter
app.get('/auth/twitter', passport.authenticate('twitter'));

//GET /auth/twitter/callback
app.get('/auth/twitter/callback',
	passport.authenticate('twitter', {
    failureRedirect: '/login'
  }),
	function(req, res) {
    console.log(req)
  	res.redirect('/content');
  }
);


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000);
console.log("Server running at http://127.0.0.1:3000 \n");
