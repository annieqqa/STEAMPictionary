const WORDS = [
  [
    "CAD",
    "Short form for computer-aided design, a method to digitally create 2D drawings and 3D models of real-world products before their production.",
  ],
  [
    "Client-server network",
    "Network where access to network resources e.g. files, pictures, etc. and overall control of the network is governed by one or many server",
  ],
  [
    "Cache",
    "A type of computer memory that stores frequently used data, etc. so that they can be retrieved quickly",
  ],
  ["Register", "Small amounts of high-speed memory located within the CPU."],
  [
    "Internet Protocol",
    "A system of rules for addressing and routing data on the Internet",
  ],
]

// let count = 0
const headerElement = document.querySelector("[data-header]")
headerElement.innerText = `You have ${WORDS.length} words to revise:`
addWord()

function addWord() {
  WORDS.forEach((obj) => {
    // count = count + 1
    let word = obj[0]
    let description = obj[1]
    const lane = document.querySelector(`[data-card]`)
    const cardElement = createCardElement(word, description)
    lane.append(cardElement)
  })
}

function createCardElement(word, description) {
  const element = document.createElement("div")
  addWordHeading(element, word)
  addWordDescription(element, description)
  element.classList.add("card-container")
  console.log(element)
  return element
}

function addWordHeading(element, heading) {
  const wordElement = document.createElement("h3")
  wordElement.innerText = heading
  wordElement.classList.add("card")
  wordElement.classList.add("word")
  element.append(wordElement)
}

function addWordDescription(element, description) {
  const descriptionElement = document.createElement("p")
  descriptionElement.innerText = description
  descriptionElement.classList.add("card")
  descriptionElement.classList.add("description")
  element.append(descriptionElement)
}
