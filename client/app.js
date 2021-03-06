var socket;

socket = io.connect();

$(function() {
  var canvas, context, currentLine, getCoord;
  $("#color").ColorPicker({
    onChange: function(hsb, hex, rgb, el) {
      return $("#color").val(hex);
    }
  });
  canvas = $("#c");
  context = canvas.get(0).getContext("2d");
  currentLine = null;
  getCoord = function(event, canvas) {
    var x, y;
    x = event.pageX - canvas.offsetLeft;
    y = event.pageY - canvas.offsetTop;
    return [x, y];
  };
  canvas.on("mousedown", function(event) {
    var color, coord, width;
    color = $("#color").val();
    width = $("#width").val();
    coord = getCoord(event, this);
    currentLine = [color, width, coord];
    context.strokeStyle = color;
    context.lineWidth = width;
    return context.lineCap = "round";
  });
  canvas.on("mousemove", function(event) {
    var coord;
    if (currentLine) {
      coord = getCoord(event, this);
      currentLine.push(coord);
      context.beginPath();
      context.moveTo(coord[0] - 0.001, coord[1] - 0.001);
      context.lineTo(coord[0], coord[1]);
      return context.stroke();
    }
  });
  canvas.on("mouseup", function(event) {
    if (currentLine) {
      socket.send(JSON.stringify(currentLine));
      return currentLine = null;
    }
  });
  return socket.on("line", function(msg) {
    var coord, _i, _len;
    context.beginPath();
    context.strokeStyle = msg.shift();
    context.lineWidth = msg.shift();
    context.moveTo.apply(context, msg.shift());
    for (_i = 0, _len = msg.length; _i < _len; _i++) {
      coord = msg[_i];
      context.lineTo.apply(context, coord);
    }
    context.stroke();
    return context.closePath();
  });
});
