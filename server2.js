/*
 * simple chat server
 */

var app = require('express').createServer();
var io = require('socket.io').listen(app);
app.listen(80);

app.get( '/', function(req, res){ res.sendfile(__dirname+'/index.html'); } );
app.get( '/socket', function(req, res){ res.sendfile(__dirname+'/socket.io.js'); } );

var peers = [];

function dropsocket(socket){ 
		delete peers[ peers.indexOf( socket ) ];
}

function broadcast(sender, msg)
{
	for(var i=0;i<peers.length;i++)
	{
		if(peers[i] != sender)
			peers[i].emit('msg', msg);
	}
}

io.sockets.on('connection', function(socket){
	peers.push( socket );
	socket.emit('welcome', { motd : 'welcome to the chatroom' } );
	socket.on( 'disconnect', dropsocket );
	socket.on( 'timeout', dropsocket );
	socket.on( 'msg', function(msg){
		broadcast(socket, msg);
		console.log(msg['user'] +":"+msg['msg']);
	});
} );
