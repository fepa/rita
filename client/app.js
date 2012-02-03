var socket;

socket = io.connect();

$(function() {
  var canvas, context, currentLine, getCoord;
  canvas = $("#c");
  console.log("canvas");
  context = canvas.get(0).getContext("2d");
  currentLine = null;
  getCoord = function(event, canvas) {
    var x, y;
    x = event.pageX - canvas.offsetLeft;
    y = event.pageY - canvas.offsetTop;
    console.log([x, y]);
    return [x, y];
  };
  canvas.on("mousedown", function(event) {
    currentLine = [getCoord(event, this)];
    return console.log("begin listening for coordinates");
  });
  canvas.on("mousemove", function(event) {
    if (currentLine) {
      currentLine.push(getCoord(event, this));
      return console.log(currentLine.length);
    }
  });
  canvas.on("mouseup", function(event) {
    if (currentLine) {
      console.log("trying to post " + currentLine);
      $.post("/line", {
        line: currentLine
      }, function(data) {
        return $("#num_listeners").text(data.listeners);
      }, "json");
      return currentLine = null;
    }
  });
  return socket.on("line", function(msg) {
    var coord, _i, _len;
    console.log(msg);
    context.moveTo.apply(context, msg.shift());
    for (_i = 0, _len = msg.length; _i < _len; _i++) {
      coord = msg[_i];
      context.lineTo.apply(context, coord);
    }
    return context.stroke();
  });
});
