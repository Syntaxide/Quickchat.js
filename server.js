/*
 * simple chat server
 */
var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);
var mjs= require('./manager.js');
var crypto = require('crypto');


var randomsalt = genSalt(1024);

console.log( mjs );
app.listen(80);

app.get( '/', function(req, res){ 
	res.sendfile(__dirname+'/create.html');
	 } );
app.get( '/join/:rid/:pwd', function(req, res){ 
	res.sendfile(__dirname+'/join.html');
	 } );
app.get( '/join', function(req, res){ 
	res.sendfile(__dirname+'/join.html');
	 } );
app.get( '/create', function(req, res){ 
	res.sendfile(__dirname+'/create.html');
	 } );
app.get( '/room/:rid/:rpw/:nick', function(req, res){ 
	res.sendfile(__dirname+'/room.html');
	 } );
app.use(express.static(__dirname+'/pub'));

function genSalt( len )
{
	var ret='';
	var chars='abcdefghijklmnopqrstuvwxyz1234567890';
	for(var i=0;i<len;i++)
	{
		ret += chars[ Math.floor( Math.random()*chars.length ) ];
	}
	return ret;
}

function genHash( rid )
{
	var md5 =  crypto.createHash('md5');
	md5.update( ( randomsalt + rid ) );
	return md5.digest('hex');
}

var connected = {};

io.sockets.on('connection', 
	function(socket){
	//peers.push( socket );
	//socket.emit('welcome', { motd : 'welcome to the chatroom' } );
	//socket.on( 'disconnect', dropsocket );
	//socket.on( 'timeout', dropsocket );
	/*socket.on( 'msg', function(msg){
		broadcast(socket, msg);
		console.log(msg['user'] +":"+msg['msg']);
	}); */


		socket.on( 'createroom', 
			function(name){
				mjs.AddRoom( name, function(r){
				   socket.emit( 'roomcreated', {rid: r, pwd: genHash(r)} );
				});
			}
		);

		socket.on( 'jrm', 
			function( data )
			{
				console.log( 'received join room request '+data.nick );
				var pwd = data.pwd;
				var rm=mjs.rooms[data.rid];
				if( pwd == genHash(data.rid) )	//proper auth
				{
					socket.emit( 'jstat', {bool: true, title: rm.name} );
					mjs.AddUser( rm, data.nick, socket );

					console.log('adding user to connected');
					connected[socket] = data.rid;

					socket.on( 'cmsg',
						function(msg){
							mjs.Broadcast( rm, msg, socket );
						});

					socket.on( 'disconnect', function( ){
						console.log('client disconnecting');
						var rid = connected[socket];
						var rm = mjs.rooms[rid];
						mjs.DropUser( rm, socket );
						if(rm.users.length == 0){	//drop room
							console.log('dropping room rid');
							delete mjs.rooms[rid];
							mjs.deadrooms.push( rid );
						}
						else{
							console.log('room '+rid+' has '+rm.users.length);
						}


					});
				}
				else
				{
					socket.emit( 'jstat', false );
				}

			});


	}
);

