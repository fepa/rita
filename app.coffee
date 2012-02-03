socket = io.connect()

$ ->
  canvas = $("#c")
  context = canvas.get(0).getContext("2d")
  currentLine = null
  getCoord = (event) ->
    x = event.pageX - canvas.offsetLeft
    y = event.pageY - canvas.offsetTop
    return [x,y]
  canvas.on "mousedown", (event) ->
    currentLine = [getCoord(event)]
  canvas.on "mousemove", (event) ->
    if currentLine
      currentLine.push getCoord(event)
  canvas.on "mouseup", (event) ->
    if currentLine
      $.post "/line", currentLine, (data) ->
        $("#num_listeners").text(data)
      currentLine = null

  socket.on "line", (msg) ->
    context.moveTo(msg.shift()...)
    for coord in msg
      context.lineTo(coord...)
    context.stroke()