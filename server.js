var app, express, fs, io, pub, redis, socket, sub;

express = require("express");

redis = require("redis");

socket = require("socket.io");

fs = require("fs");

pub = redis.createClient();

sub = redis.createClient();

app = express.createServer();

io = socket.listen(app);

app.use(express.bodyParser());

app.use(express.logger());

app.use(express.static(__dirname));

io.sockets.on("connection", function(socket) {
  sub.subscribe("line");
  sub.on("message", function(channel, msg) {
    return socket.emit(channel, JSON.parse(msg));
  });
  return socket.on("message", function(msg) {
    return pub.publish("line", msg, function(err, num) {
      return console.log(err, num);
    });
  });
});

app.listen(3000);
