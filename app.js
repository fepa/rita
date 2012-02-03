var socket;

socket = io.connect();

$(function() {
  var canvas, context, currentLine, getCoord;
  canvas = $("#c");
  context = canvas.get(0).getContext("2d");
  currentLine = null;
  getCoord = function(event) {
    var x, y;
    x = event.pageX - canvas.offsetLeft;
    y = event.pageY - canvas.offsetTop;
    return [x, y];
  };
  canvas.on("mousedown", function(event) {
    return currentLine = [getCoord(event)];
  });
  canvas.on("mousemove", function(event) {
    if (currentLine) return currentLine.push(getCoord(event));
  });
  canvas.on("mouseup", function(event) {
    if (currentLine) {
      $.post("/line", currentLine, function(data) {
        return $("#num_listeners").text(data);
      });
      return currentLine = null;
    }
  });
  return socket.on("line", function(msg) {
    var coord, _i, _len;
    context.moveTo.apply(context, msg.shift());
    for (_i = 0, _len = msg.length; _i < _len; _i++) {
      coord = msg[_i];
      context.lineTo.apply(context, coord);
    }
    return context.stroke();
  });
});
