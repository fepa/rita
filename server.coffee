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

app.post "/line", (req, res, next) ->
  console.log req.body
  pub.publish "line", JSON.stringify(req.body.line), (err, num) ->
    if err then res.send err, 500
    else res.send listeners: num
    console.log err, num

io.sockets.on "connection", (socket) ->
  sub.subscribe "line"
  sub.on "message", (channel, msg) ->
    console.log msg
    socket.emit channel, JSON.parse(msg)

app.listen 3000