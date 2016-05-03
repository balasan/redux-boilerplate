import socket_io from 'socket.io';

// import {InvestEvents} from '../api/invest/invest.controller';

//needs work
var clients = {};

var events = {
  // invest: InvestEvents,
  // online: OnlineEvents
};

// When the user disconnects.. perform this
function onDisconnect(socket, user) {
  if (user) delete clients[currentUser._id];
  console.log(clients, 'clients');
  console.log('socket disconnected');
}

// When the user connects.. perform this
function onConnect(socket, io) {
  // When the client emits 'info', this listens and executes
  socket.on('info', data => {
    socket.log(JSON.stringify(data, null, 2));
  });

  // Insert sockets below
  register(socket, io)
  // require('../api/invest/invest.socket').register(socket);
}

function register(socket, io) {
  // Bind model events to socket events
  for( var event in events) {
    var eventListener = events[event];
    var listener = createListener(socket, io);
    eventListener.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
}

function createListener(socket, io) {
  return function(data) {
    if (data._id) {
      //console.log(data._id, 'data._id in createListener');
      var clientId = clients[data._id];
      console.log('emit to ', clientId);
      clientId.forEach(function(id) {
        io.to(id).emit('action', data);
      })
    }
    else socket.emit('action', data);
  };
}

function removeListener(event, listener) {
  return function() {
    var eventListener = events[event];
    eventListener.removeListener(event, listener);
  };
}


export default function (server) {

  var io = socket_io();
  io.attach(server);

  io.on('connection', function(socket){

    socket.address = socket.request.connection.remoteAddress +
      ':' + socket.request.connection.remotePort;

    socket.connectedAt = new Date();

    socket.log = function(...data) {
      console.log(`SocketIO ${socket.nsp.name} [${socket.address}]`, ...data);
    };

    onConnect(socket, io)
    console.log("CONNECTED")

    var currentUser = null;

    socket.on('action', (action) => {

      console.log("Socket", action.type)

      if (action.type === 'server/hello') {
        console.log('Got hello data!', action.payload);
        socket.emit('action', {type:'message', payload:'good day!'});
      }

      if (action.type === 'server/storeUser') {
        currentUser = action.payload;
        var arr = clients[action.payload._id] || null;
        if( !arr )
            clients[action.payload._id] = arr = [];
        if( arr.indexOf( socket.id ) === -1 )
            arr.push( socket.id );

      }
    })

    socket.on('disconnect', () => {
      //if (currentUser) delete clients[currentUser._id];
      if (currentUser) {
        var arr = clients[currentUser._id] || null;
        if( !arr ) return; // Should not happen since an user must connect before being disconnected
        var index = arr.indexOf( socket.id );
        if( index !== -1 )
            arr.splice( index, 1 ); // Removes socket id from user


        var notification = {
          type: 'SET_ONLINE_USERS',
          payload: {
            users: clients,
          }
        }

        OnlineEvents.emit('online', notification);
        console.log('socket disconnected');
      }

    });
  });
}