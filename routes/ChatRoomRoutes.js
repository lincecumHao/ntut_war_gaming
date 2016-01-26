var ChatRoomUserNames = (function () {
  var names = {};
  var test = "123";

  var claim = function (name) {
    if (!name || names[name]) {
      return false;
    } else {
      names[name] = true;
      return true;
    }
  };

  // find the lowest unused "guest" name and claim it
  var getGuestName = function () {
    var name,
      nextUserId = 1;

    do {
      name = 'Guest ' + nextUserId;
      nextUserId += 1;
    } while (!claim(name));

    return name;
  };

  // serialize claimed names as an array
  var get = function () {
    var res = [];
    for (user in names) {
      if(user.indexOf("Guest") == -1){
        res.push(user);
      }
    }

    return res;
  };

  var set = function(username) {
    free(username);
    claim(username);
  }

  var free = function (name) {
    if (names[name]) {
      delete names[name];
    }
  };

  return {
    claim: claim,
    free: free,
    getAll: get,
    addUser: set,
    getGuestName: getGuestName
  };
}());

// export function for listening to the socket
module.exports = function (socket) {

  var name;

  socket.on("userLogin", function(user){
    console.log(user);
    name = user.name;
    ChatRoomUserNames.free(name);
    socket.emit("currentUsers", ChatRoomUserNames.getAll());
    ChatRoomUserNames.addUser(name);
    socket.broadcast.emit('user:join', name);
  });

  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
    socket.emit('send:message', data);
    socket.broadcast.emit('send:message', data);
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    socket.broadcast.emit('user:left', name);
    ChatRoomUserNames.free(name);
  });
};