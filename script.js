const Gameboard = (() => {
  const rows = 3
  const cols = 3
  const board = []

  const Cell = () => {
    let value = ""

    const setMark = (mark) => {
      value = mark
    }

    const getValue = () => value

    return {
      setMark,
      getValue,
    }
  }

  const getCell = (row, col) => board[row][col]

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues);
  }

  const addMark = (mark, row, col) => {
    // Only add a mark if the Cell is empty
    if (!getCell(row, col).getValue()) {
      getCell(row, col).setMark(mark)
      return true
    }
    return false
  }

  return {
    getBoard,
    printBoard,
    addMark,
    getCell,
  }
})()

const Player = (name, mark) => {
  return {
    name, 
    mark
  }
}

const GameController = (() => {
  const p1 = Player("p1")
  p1.mark = "X"

  const p2 = Player("p2")
  p2.mark = "O"

  let activePlayer = p1

  const getActivePlayer = () => activePlayer

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === p1 ? p2 : p1;
  }

  const printNewRound = () => {
    Gameboard.printBoard()
    console.log(`${getActivePlayer().name}'s turn.`)
  }

  const playRound = (row, col) => {
    if (Gameboard.addMark(getActivePlayer().mark, row, col)) {
      if (checkForWinner()) {
        announceWinner()
      } else if (checkForTie()) {
        console.log("It's a tie!")
      } else {
        switchPlayerTurn()
        printNewRound()
      }
    }
  }

  let winner

  const getWinner = () => winner

  const announceWinner = () => {
    console.log(`${getWinner()} has won!`)
  }

  const checkForTie = () => {
    // if tie return true. Maybe make a tie var like the winner var
  }

  const checkForWinner = () => {
    const winConditions = [
      [ [0, 0], [0, 1], [0, 2] ],
      [ [1, 0], [1, 1], [1, 2] ],
      [ [2, 0], [2, 1], [2, 2] ],
      [ [0, 0], [1, 0], [2, 0] ],
      [ [0, 1], [1, 1], [2, 1] ],
      [ [0, 2], [1, 2], [2, 2] ],
      [ [0, 0], [1, 1], [2, 2] ],
      [ [0, 2], [1, 1], [2, 0] ],
    ]

    for (const winCondition of winConditions) {
      let row = ""
      let col = ""
      let cellValues = []

      for (const elem of winCondition) {
        row = elem[0]
        col = elem[1]
        cellValues.push(Gameboard.getCell(row, col).getValue())
      }

      if (cellValues.every(cellValue => cellValue !== "")) {
        // if the cell values have the same value as the win condition, we have a winner
        if ( (cellValues[0] === cellValues[1]) && (cellValues[1] == cellValues[2]) ) {
          winner = getActivePlayer().name
          return true
        }
      }
    }
  }

  printNewRound()

  return {
    getActivePlayer,
    playRound,
    getWinner,
  }
})()

const DisplayController = (() => {
  const boardDiv = document.querySelector(".board")
  const msgDiv = document.querySelector(".msg")

  const updateDisplay = () => {
    const board = Gameboard.getBoard()
    const activePlayer = GameController.getActivePlayer()

    boardDiv.textContent = ""

    if (!GameController.getWinner()) {
      msgDiv.textContent = `${activePlayer.name}'s turn...`
    } else {
      msgDiv.textContent = `${activePlayer.name} has won!`
    }

    board.forEach((row, idx) => {
      const rowDiv = document.createElement("div")
      rowDiv.className = "row"
      rowDiv.dataset.row = idx
      boardDiv.appendChild(rowDiv)

      row.forEach((cell, idx) => {
        const cellButton = document.createElement("button")
        cellButton.className = "button"
        cellButton.dataset.col = idx
        cellButton.textContent = cell.getValue()
        rowDiv.appendChild(cellButton)
      })
    })
  }

  boardDiv.addEventListener("click", (e) => {
    // don't do anything if we have a winner
    if (GameController.getWinner()) return

    const selectedRow = e.target.parentElement.dataset.row
    const selectedCol = e.target.dataset.col

    if (!selectedRow && !selectedCol) return

    GameController.playRound(selectedRow, selectedCol)
    updateDisplay()
  });

  updateDisplay()

})()


// Do logic for detecting a tie
// Display tie message in the frontend
// Implement start and stop buttons
