this.rooms = [];
this.deadrooms = [];	//contains indices of dropped rooms

/*
 * takes name of room
 * tries to insert into empty index
 * otherwise appends
 * returns: index of room
 */
this.AddRoom = function( name , callback){
	var r;
	if( this.deadrooms.length == 0)
		 r = this.rooms.length;
	else
		r = this.deadrooms.pop();
	this.rooms[r] = this.Room(name);
	console.log('created room:'+name+'@'+r);
	callback( r );
};

//--------------------------------------------------
this.Room = function( name ) {
	var rm = {};
	rm.name = name;
	rm.users = [];	// {nick, socket}
	return rm;
	//this.socket 
};

this.AddUser = function( rm, user, socket ) {
	rm.users.push( {nick: user, socket: socket} );
};

this.DropUser = function( rm, socket ) {
	for(var x=0;x<rm.users.length;x++)
	{
		if( rm.users[x].socket == socket )
		{
			console.log('found user at '+x);
			console.log('dropped');
			console.log(rm.users);
			delete rm.users[x];
			console.log(rm.users);
			break;
		}
	}
};

this.Broadcast = function( rm, message, sender_socket ) {
	console.log( 'broadcasting message '+message);
	//find user
	var sendnick = 'NOT FOUND SENDER';
	for(var i=0;i<rm.users.length;i++)
	{
		if( rm.users[i].socket == sender_socket )
		{
			sendnick = rm.users[i].nick;
			break;
		}
	}

	//send to all users
	for(var x=0;x<rm.users.length;x++)
	{
		rm.users[x].socket.emit( 'smsg', {nick:sendnick, msg:message} );
	}
};


//--------------------------------------------------
