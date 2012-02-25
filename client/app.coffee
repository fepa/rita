socket = io.connect()

$ ->
  $("#color").ColorPicker({onChange: (hsb, hex, rgb, el) ->
    $("#color").val(hex)
  })
  canvas = $("#c")
  context = canvas.get(0).getContext("2d")
  currentLine = null
  getCoord = (event, canvas) ->
    x = event.pageX - canvas.offsetLeft
    y = event.pageY - canvas.offsetTop
    return [x,y]
  canvas.on "mousedown", (event) ->
    color = $("#color").val()
    console.log color
    currentLine = [color, getCoord(event, this)]
  canvas.on "mousemove", (event) ->
    if currentLine
      currentLine.push getCoord(event, this)
  canvas.on "mouseup", (event) ->
    if currentLine
      console.log "trying to post " + currentLine
      $.post "/line", {line: currentLine}, (data) ->
        $("#num_listeners").text(data.listeners)
      , "json"
      currentLine = null

  socket.on "line", (msg) ->
    context.beginPath()
    context.strokeStyle = msg.shift() # Pop color from array
    context.moveTo(msg.shift()...)
    for coord in msg
      context.lineTo(coord...)
    context.stroke()
    context.closePath()