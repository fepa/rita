socket = io.connect()

$ ->
  $("#color").ColorPicker({onChange: (hsb, hex, rgb, el) ->
    $("#color").val(hex)
  })
  canvas = $("#c")
  console.log canvas
  context = canvas.get(0).getContext("2d")
  currentLine = null
  getCoord = (event, canvas) ->
    x = event.pageX - canvas.offsetLeft
    y = event.pageY - canvas.offsetTop
    console.log [x,y]
    return [x,y]
  canvas.on "mousedown", (event) ->
    color = $("#color").text()
    console.log "color is: " + color
    currentLine = [color, getCoord(event, this)]
    console.log "begin listening for coordinates"
  canvas.on "mousemove", (event) ->
    if currentLine
      currentLine.push getCoord(event, this)
      console.log currentLine.length
  canvas.on "mouseup", (event) ->
    if currentLine
      console.log "trying to post " + currentLine
      $.post "/line", {line: currentLine}, (data) ->
        $("#num_listeners").text(data.listeners)
      , "json"
      currentLine = null

  socket.on "line", (msg) ->
    console.log msg
    context.moveTo(msg.shift()...)
    for coord in msg
      context.lineTo(coord...)
    context.stroke()