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
    var color;
    color = $("#color").val();
    console.log(color);
    return currentLine = [color, getCoord(event, this)];
  });
  canvas.on("mousemove", function(event) {
    if (currentLine) return currentLine.push(getCoord(event, this));
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
    context.beginPath();
    context.strokeStyle = msg.shift();
    context.moveTo.apply(context, msg.shift());
    for (_i = 0, _len = msg.length; _i < _len; _i++) {
      coord = msg[_i];
      context.lineTo.apply(context, coord);
    }
    context.stroke();
    return context.closePath();
  });
});
