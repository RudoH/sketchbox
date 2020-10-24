const container = document.getElementById("gridContainer");
const newGridButton = document.getElementById("newGridButton");
const autoDrawButton = document.getElementById("autoDrawButton");
const colorInput = document.getElementById("colorPicker");
const borderSelect = document.getElementById('borderSelect');
let gridSize = 16;
let totalSize = gridSize * gridSize;
let color = "#BB3333";
let colorCounter = 0;
let mouseDown = false;
let drawing = false;
let autoDrawInterval;
let direction;
let squareNum = Math.floor(Math.random() * totalSize) + 1;
let currentSquare;

document.addEventListener("mousedown", () => (mouseDown = true));
document.addEventListener("mouseup", () => (mouseDown = false));

createGrid();
addHoverListeners();

newGridButton.addEventListener("click", setNewGrid);
autoDrawButton.addEventListener("click", autoDraw);
colorInput.addEventListener("change", (e) => (color = e.target.value));

function setNewGrid(e) {
  e.preventDefault();
  gridSize = Number(document.getElementById("gridSize").value);
  totalSize = gridSize * gridSize;
  squareNum = Math.floor(Math.random() * totalSize) + 1;
  removeChildNodes(container);
  createGrid();
  addHoverListeners();
}

function createGrid() {
  for (let i = 1; i <= gridSize * gridSize; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    if (borderSelect.checked) square.classList.add("border")
    square.setAttribute("id", `square-${i}`);
    square.style.width = `${(750 - (borderSelect.checked && gridSize * 2)) / gridSize}px`;
    square.style.height = `${(750 - (borderSelect.checked && gridSize * 2)) / gridSize}px`;
    container.appendChild(square);
  }
}

function removeChildNodes(parentNode) {
  while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.firstChild);
  }
}

function addHoverListeners() {
  const squares = document.querySelectorAll(".square");
  squares.forEach((square) => {
    square.addEventListener("mouseover", () => {
      if (mouseDown) square.style.backgroundColor = color;
    });
  });
}

function autoDraw(e) {
  e.preventDefault();
  if (drawing) {
    clearInterval(autoDrawInterval);
    autoDrawButton.textContent = "Start Autodraw";
    drawing = false;
  } else {
    autoDrawButton.textContent = "Stop Autodraw";
    autoDrawInterval = setInterval(() => {
      currentSquare = document.getElementById(`square-${squareNum}`);
      currentSquare.style.backgroundColor = color;
      squareNum = pickNewSquare(squareNum);
    }, 1);
    drawing = true;
  }
}

function pickNewSquare(squareNum) {
  let newDirection = Math.floor(Math.random() * 4);
  while (newDirection % 2 === direction % 2 && newDirection !== direction) {
    console.log(newDirection, direction, newDirection === direction);
    newDirection = Math.floor(Math.random() * 4);
  }

  direction = newDirection;

  colorCounter++;
  if (colorCounter > 19) {
    colorCounter = 0;
    color = pickRandomColor();
    colorInput.value = color;
  }

  if (direction === 0 && squareNum > gridSize) return squareNum - gridSize;
  else if (direction === 1 && squareNum % gridSize !== 0)
    return Number(squareNum + 1);
  else if (direction === 2 && squareNum <= totalSize - gridSize)
    return Number(squareNum) + gridSize;
  else if (direction === 3 && squareNum % gridSize !== 1) return squareNum - 1;
  else return pickNewSquare(squareNum);
}

function pickRandomColor() {
  let color = "#";
  const hexValues = "0123456789ABCDEF";
  for (let i = 0; i < 6; i++) {
    color += hexValues[Math.floor(Math.random() * 16)];
  }
  return color;
}
