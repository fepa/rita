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

app.post("/line", function(req, res, next) {
  console.log(req.body);
  return pub.publish("line", JSON.stringify(req.body.line), function(err, num) {
    if (err) {
      res.send(err, 500);
    } else {
      res.send({
        listeners: num
      });
    }
    return console.log(err, num);
  });
});

io.sockets.on("connection", function(socket) {
  sub.subscribe("line");
  return sub.on("message", function(channel, msg) {
    console.log(msg);
    return socket.emit(channel, JSON.parse(msg));
  });
});

app.listen(3000);
