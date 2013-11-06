var connect = require('connect');

//create server

var server = connect.createServer();

//handle static files
server.use(connect.static(__dirname + '/'));

//listen
server.listen(3000, 'localhost');
