import { io } from "socket.io-client"
import DrawableCanvas from "./DrawableCanvas.js"

const production = process.env.NODE_ENV === "production"
const serverURL = production ? "steamPictionary.xyz" : "http://localhost:3000"

const urlParams = new URLSearchParams(window.location.search)

const usernameElement = document.querySelector("[data-username]")
const roomIdElement = document.querySelector("[data-roomId]")
const name = urlParams.get("name")
const roomId = urlParams.get("room-id")
usernameElement.innerText = name
roomIdElement.innerText = `Room ID: ${roomId}`

if (!name || !roomId) window.location = "/index.html"

const socket = io(serverURL)
const guessForm = document.querySelector("[data-guess-form]")
const guessInput = document.querySelector("[data-guess-input]")
const wordElement = document.querySelector("[data-word]")
const wordDescriptionElement = document.querySelector("[data-word-description]")
const messagesElement = document.querySelector("[data-messages]")
const readyButton = document.querySelector("[data-ready-btn]")
const canvas = document.querySelector("[data-canvas]")
const palette = document.querySelector("[data-color-palette]")
const navBar = document.querySelector("[data-nav-bar]")
// const addWordButton = document.querySelector("[data-add-word-btn]")
// console.log(palette.offsetWidth, canvas.width)
const drawableCanvas = new DrawableCanvas(navBar, palette, canvas, socket)
const guessTemplate = document.querySelector("[data-guess-template]")

socket.emit("join-room", { name: name, roomId: roomId })
socket.on("start-drawer", startRoundDrawer)
socket.on("start-guesser", startRoundGuesser)
socket.on("guess", displayGuess)
socket.on("winner", endRound)
hide(wordElement)
hide(wordDescriptionElement)
endRound()
resizeCanvas()
setupHTMLEvents()

// revisionWords = {}
// let data = []
// function Word (word, description){
//   this.word = word
//   this.description = description
// }
// localStorage.setItem("object_name",JSON.stringify(data));

function setupHTMLEvents() {
  readyButton.addEventListener("click", () => {
    hide(readyButton)
    // hide(addWordButton)
    socket.emit("ready")
  })

  guessForm.addEventListener("submit", (e) => {
    e.preventDefault()

    if (guessInput.value === "") return

    socket.emit("make-guess", { guess: guessInput.value })
    displayGuess(name, guessInput.value)

    guessInput.value = ""
  })

  window.addEventListener("resize", resizeCanvas)
}

function displayGuess(guesserName, guess) {
  const guessElement = guessTemplate.content.cloneNode(true)
  const messageElement = guessElement.querySelector("[data-text]")
  const nameElement = guessElement.querySelector("[data-name]")
  nameElement.innerText = guesserName
  messageElement.innerText = guess
  messagesElement.append(guessElement)
}

function startRoundDrawer(word, wordDescription) {
  drawableCanvas.canDraw = true
  drawableCanvas.clearCanvas()
  messagesElement.innerHTML = ""
  wordElement.innerText = word
  wordDescriptionElement.innerText = wordDescription
  show(wordElement)
  show(wordDescriptionElement)
}

function startRoundGuesser() {
  show(guessForm)
  hide(wordElement)
  drawableCanvas.clearCanvas()

  messagesElement.innerHTML = ""
  wordElement.innerText = ""
}

function resizeCanvas() {
  canvas.width = null
  canvas.height = null
  const clientDimensions = canvas.getBoundingClientRect()
  canvas.width = clientDimensions.width
  canvas.height = clientDimensions.height
}

function endRound(name, word) {
  // hide(addWordButton)
  hide(wordElement)
  hide(wordDescriptionElement)
  if (word && name) {
    wordElement.innerText = word
    show(wordElement)
    displayGuess(null, `${name} got it right! The answer is ${word}.`)
    // show(addWordButton)
  }

  drawableCanvas.canDraw = false
  show(readyButton)
  hide(guessForm)
}

function hide(element) {
  element.classList.add("hide")
}

function show(element) {
  element.classList.remove("hide")
}
