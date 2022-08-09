const tileDisplay = document.querySelector(".tile-container");
const keyboard = document.querySelector(".key-container");
const messsageDisplay = document.querySelector(".message-container");

let wordle;

function getWordle() {
  fetch("http://localhost:8000/word").then((response) =>
    response
      .json()
      .then((json) => {
        wordle = json.toUpperCase();
      })
      .catch((err) => console.log(err))
  );
}

getWordle();

const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "ENTER",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "«",
];

const guessRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement("div");
  rowElement.setAttribute("id", "guessRow-" + guessRowIndex);
  guessRow.forEach((_guess, guessIndex) => {
    const tileElement = document.createElement("div");
    tileElement.setAttribute(
      "id",
      "guessRow-" + guessRowIndex + "-tile-" + guessIndex
    );
    tileElement.classList.add("tile");

    rowElement.append(tileElement);
  });
  tileDisplay.append(rowElement);
});

keys.forEach((key) => {
  const buttonElement = document.createElement("button");
  buttonElement.textContent = key;
  keyboard.append(buttonElement);
  buttonElement.setAttribute("id", key);

  buttonElement.addEventListener("click", () => handleClick(key));
  keyboard.append(buttonElement);

  function handleClick(letter) {
    if (!isGameOver) {
      console.log("clicked", letter);
      if (letter === "ENTER") {
        checkRow();

        return;
      }
      if (letter == "«") {
        deleteLetter();

        return;
      }
      addLetter(letter);
    }
  }
  function addLetter(letter) {
    if (currentTile < 5 && currentRow < 6) {
      const tile = document.getElementById(
        "guessRow-" + currentRow + "-tile-" + currentTile
      );
      tile.textContent = letter;
      guessRows[currentRow][currentTile] = letter;
      tile.setAttribute("data", letter);
      currentTile++;
    }
  }
});

function deleteLetter() {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    tile.textContent = "";
    guessRows[currentRow][currentTile] = "";
    tile.setAttribute("data", "");
  }
}

function checkRow() {
  const guess = guessRows[currentRow].join("");

  if (currentTile > 4) {
    fetch(`http://localhost:8000/check/?word=${guess}`)
      .then((response) => response.json())
      .then((json) => {
        if (json == "Entry word not found") {
          showMessage("word not in list");
          return;
        } else {
          flipTile();
          if (wordle == guess) {
            showMessage("you won!");
            isGameOver = true;
            return;
          } else {
            if (currentRow >= 5) {
              isGameOver = true;
              showMessage("game over!");
              return;
            }
            if (currentRow < 5) {
              currentRow++;
              currentTile = 0;
            }
          }
        }
      })
      .catch((err) => console.log(err));
  }
}

function showMessage(message) {
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  messsageDisplay.append(messageElement);
  setTimeout(() => messsageDisplay.removeChild(messageElement), 2000);
}

function addColourToKey(keyLetter, color) {
  const key = document.getElementById(keyLetter);
  key.classList.add(color);
}

function flipTile() {
  const rowTiles = document.querySelector("#guessRow-" + currentRow).childNodes;
  let checkWordle = wordle;
  const guess = [];

  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute("data"), color: "grey-overlay" });
  });

  guess.forEach((guess, index) => {
    if (guess.letter == wordle[index]) {
      guess.color = "green-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = "yellow-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("flip");
      tile.classList.add(guess[index].color);
      addColourToKey(guess[index].letter, guess[index].color);
    }, 500 * index);
  });
}
