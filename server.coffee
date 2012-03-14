express = require "express"
redis = require "redis"
socket = require "socket.io"
fs = require "fs"

pub = redis.createClient()
sub = redis.createClient()

app = express.createServer()

io = socket.listen app

app.use express.bodyParser()
app.use express.logger()
app.use express.static(__dirname)

io.sockets.on "connection", (socket) ->
  sub.subscribe "line"
  sub.on "message", (channel, msg) ->
    socket.emit channel, JSON.parse(msg)
  socket.on "message", (msg) ->
    pub.publish "line", msg, (err, num) ->
      console.log err, num

app.listen 3000