const blackButton = document.getElementsByClassName("black")[0]
const redButton = document.getElementsByClassName("red")[0]
const orangeButton = document.getElementsByClassName("orange")[0]
const yellowButton = document.getElementsByClassName("yellow")[0]
const greenButton = document.getElementsByClassName("green")[0]
const blueButton = document.getElementsByClassName("blue")[0]
const purpleButton = document.getElementsByClassName("purple")[0]
const eraser = document.getElementsByClassName("eraser")[0]

export default function DrawableCanvas(navbar, palette, canvas, socket) {
  //class
  this.canDraw = false
  this.clearCanvas = function () {
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  let prevPosition = null

  let color = "black"
  let lineWidth = 2

  blackButton.addEventListener("click", () => {
    color = "black"
    lineWidth = 2
  })
  redButton.addEventListener("click", () => {
    color = "red"
    lineWidth = 2
  })
  orangeButton.addEventListener("click", () => {
    color = "orange"
    lineWidth = 2
  })
  yellowButton.addEventListener("click", () => {
    color = "yellow"
    lineWidth = 2
  })
  greenButton.addEventListener("click", () => {
    color = "green"
    lineWidth = 2
  })
  blueButton.addEventListener("click", () => {
    color = "blue"
    lineWidth = 2
  })
  purpleButton.addEventListener("click", () => {
    color = "purple"
    lineWidth = 2
  })
  eraser.addEventListener("click", () => {
    color = "white"
    lineWidth = 20
  })

  canvas.addEventListener("mousemove", (e) => {
    if (e.buttons !== 1 || !this.canDraw) {
      // if not using left click to draw
      prevPosition = null
      return
    }

    const newPosition = { x: e.layerX, y: e.layerY }
    if (prevPosition != null) {
      drawLine(prevPosition, newPosition, lineWidth, color)
      socket.emit("draw", {
        start: normalizeCoordinates(prevPosition),
        end: normalizeCoordinates(newPosition),
        lineWidth: lineWidth,
        color: color,
      })
    }

    prevPosition = newPosition
  })

  canvas.addEventListener("mouseleave", () => (prevPosition = null))
  socket.on("draw-line", (start, end, lineWidth, color) => {
    drawLine(toCanvasSpace(start), toCanvasSpace(end), lineWidth, color)
  })

  function drawLine(start, end, lineWidth, color) {
    const ctx = canvas.getContext("2d")
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color
    ctx.beginPath()
    // console.log(start.x, palette.offsetWidth, start.y)
    ctx.moveTo(start.x - palette.offsetWidth, start.y - navbar.offsetHeight)
    ctx.lineTo(end.x - palette.offsetWidth, end.y - navbar.offsetHeight)
    ctx.stroke()
  }

  function normalizeCoordinates(position) {
    return {
      x: position.x / canvas.width,
      y: position.y / canvas.height,
    }
  }

  function toCanvasSpace(position) {
    return {
      x: position.x * canvas.width,
      y: position.y * canvas.height,
    }
  }
}
