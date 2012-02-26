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
    coord = getCoord(event, this)
    currentLine = [color, coord]
    # Configure line
    context.strokeStyle = color
    context.lineWidth = 10;
    context.lineCap = "round"
  canvas.on "mousemove", (event) ->
    if currentLine
      coord = getCoord(event, this)
      currentLine.push coord
      # Draw as mouse moves
      context.beginPath()
      context.moveTo coord[0]-0.001, coord[1]-0.001 # -0.001 is to force Chrome to draw, if moveTo() and lineTo() have equal coordinates then Chrome doesn't draw
      context.lineTo coord[0], coord[1]
      context.stroke()
  canvas.on "mouseup", (event) ->
    if currentLine
      console.log "trying to post " + currentLine
      $.post "/line", {line: currentLine}, (data) ->
        $("#num_listeners").text(data.listeners)
      , "json"
      currentLine = null
      context.closePath()

  socket.on "line", (msg) ->
    context.beginPath()
    context.strokeStyle = msg.shift() # Pop color from array
    context.moveTo(msg.shift()...)
    for coord in msg
      context.lineTo(coord...)
    context.stroke()
    context.closePath()