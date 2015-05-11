var mongo = require('mongodb').MongoClient,
	cocksocket = require('socket.io').listen('8080').sockets,	//"can be any port"
	clients = {},
	sessionID;
	
mongo.connect('mongodb://127.0.0.1/chat', function(err, db){
	if(err) throw err;

//initialize the connection
	cocksocket.on('connection', function(socket) {
				
			//console.log(socket.id);
			
		
			//pass through sessionID
			socket.on('roomjoin', function(data){
				var sessionID = data;
				console.log(sessionID); //works! (says the session ID on the console)
				socket.join(sessionID);
				clients[socket.id] = sessionID;
				//console.log(clients[socket.id]);
				cocksocket.in('dick').emit('mans',clients);
			
				//emit all messages to mans in room
				var col = db.collection(sessionID); //change messages to unique ID?
				col.find().limit(100).sort({_id: 1}).toArray(function(err, res) {
					if(err) throw err;					
					socket.emit('slut', res);		
				});
			});	
			
						
		
		//wait for input
		socket.on('input' , function(data) {
			
			//console.log(data.message); //happens everytime enter is pressed even if no message
			var sessionID = data.sessionID,
				name = data.name,
				message = data.message,
				whiteSpacePattern = /^\s*$/;
			
			if (whiteSpacePattern.test(message)) {
				socket.emit('status',{
					message: "message requard" //does nothing atm but useful later
				});
			} else {
				socket.emit('status', {
					clear:true
				});
				col = db.collection(sessionID);
				//console.log(sessionID);
				col.insert({name: name, message: message}, function(){
					//emit latest message
					cocksocket.in(sessionID).emit('slut', [data]); //emit to room (named by their sessionID)
				});

			}
		});
		
		//trying to get clicking on the names to do shit
		socket.on('lick', function(data){
		cocksocket.in(data).emit('slut', [{message: data + "tation"}]); //message not appearing doe
			//console.log(data);
		});
		
		//disconnect and remove from clients ting
		socket.on('disconnect', function(data){
			delete clients[socket.id];
			console.log(clients);
		});
						
	});
});