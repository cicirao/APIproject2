var util        = require('util'),
    OAuth       = require('oauth').OAuth;

var oa = new OAuth('https://api.twitter.com/oauth/request_token',
                  'https://api.twitter.com/oauth/access_token',
                  'EtXcMyqnlDgvruH85NKsw',
                  'gFJ7ST2USrrxF6yZwpkE1CmZaZONJ5cFdo1vg2q2ALQ',
                  '1.0',
                  null,
                  'HMAC-SHA1');

var global_secret_lookup = {};

exports.requestToken = function(req, res) {
  console.log('Default URL');
  oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
    if(error) {
      console.log('error :' + util.inspect(error));
      var errResponse = 'Unable to retrieve request token';
      res.send(400, errResponse)
    }
    else {
      console.log('oauth_token: ' + oauth_token);
      console.log('oauth_token_secret: ' + oauth_token_secret);
      console.log('requestoken results: ' + util.inspect(results));

      // I'm sure there's a better way than storing in a single
      // global variable (it's not threadsafe, but works for illustrations)
      global_secret_lookup[oauth_token] = oauth_token_secret;

      // NOTE: we use the AUTHENTICATE, not the AUTHORIZE URL here
      var twitterAuthEndpoint = 'https://api.twitter.com/oauth/authenticate?oauth_token=' + oauth_token;
      console.log('Redirecting to ' + twitterAuthEndpoint);
      res.redirect(twitterAuthEndpoint)
    }
  });
}

exports.requestAccess = function(req, res) {
  console.log('Callback URL');
  var parsedQuery = req.query

  // If there's no oauth_token parameter then the user must have
  // denied access. Bail.
  if(typeof(parsedQuery['oauth_token']) === 'undefined') {
    console.log('User failed to authorize access');
    var accessDenied = 'Please grant access to continue...'
    res.send(400, accessDenied)
    return;
  }

  var oauth_token = parsedQuery['oauth_token'];
  var oauth_verifier = parsedQuery['oauth_verifier']
  // !IMPORTANT!
  // Grab an access token. Twitter won't remember that the user authorized
  // the application for authentication unless we grab an access token
  oa.getOAuthAccessToken(oauth_token
    , global_secret_lookup[oauth_token]
    , oauth_verifier
    , function(error, oauth_access_token, oauth_access_token_secret, results) {
    if (error) {
      console.log('error: ', error)
      res.send(400, error.data)
      return;
    }
    console.log('Requested access token');
    console.log('oauth_access_token: ', oauth_access_token);
    console.log('oauth_token_secret: ', oauth_access_token_secret);
    console.log('accesstoken results: ', util.inspect(results));

    var stringifiedResults = JSON.stringify(results);
    res.send(stringifiedResults)
  });
}
