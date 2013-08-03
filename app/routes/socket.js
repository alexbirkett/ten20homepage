/*
 * Serve content over a socket
 */

/* --- interface ---
timePoint:
currentSpeed:
lastActTime:
virtualFence:
elevation:
geodata: [
  {time: , lat: , lng: }...
]
*/

module.exports = function (socket) {
  var user =  {};
  var trackers = {};

  function initTrackers(cb) {
    for (var i = 0; i < user.trackers.length; i++) {
      user.trackers[i]
    };
  }

  // initialize user and trackers info
  socket.on('init:start', function(data) {
    db.user.findOne({_id: data.id}, function(error, user) {
      if (error) {
        socket.disconnect();
      } else {
        user = user;
        initTrackers(function() {
          socket.emit('init:ok', {trackers: trackers});
        });
      }
    });
  });

  // get trackers current location info
  socket.on('get:current', function() {
  });

  // get trackers current location info
  socket.on('get:history', function(data) {
  });

  setInterval(function () {
    io.sockets.emit('send:time', {
      time: (new Date()).toString()
    });
  }, 1000);
};
