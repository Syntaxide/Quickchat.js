function Room() {
	this.users = [];
}

Room.AddUser = function( user ) {
	room.users.push( user );
}

Room.DropUser = function( socket ) {
	for(var x=0;x<room.users.length;x++)
	{
		if( room.users[x].socket == socket )
		{
			delete room.users[x];
			break;
		}
	}
}

//--------------------------------------------------
function User(socket, name){
	this.socket = socket;
	this.name = name;
}
