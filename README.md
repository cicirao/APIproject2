About One
========

This is a Web Application written by nodejs.

It could get a collection or a mashup of the lastest updates of one person that you care about, from different SNS platform. At this time, it could get data from Twitter and Facebook.

By using this web application, you can get a wall of tweets and Facebook stories here. Everything is about the person. 


The API that I used: 
----------


###Twitter REST API. 



get user data from the resource:


https://api.twitter.com/1.1/users/show.json

    
    
get timeline from the resource:


https://api.twitter.com/1.1/statuses/user_timeline.json



###The graph api of Facebook. 



get user data:


https://graph.facebook.com/{query}?fields=name,picture



get feeds:


https://graph.facebook.com/{query}?fields=posts



get photo wall:


https://graph.facebook.com/{query}?fields=photos



###The module that I used: 


passport.

express. 

ejs.



=================
I have to say I couldn't get the mashup at one time now.
So some work need to be continued.
