let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameOver = false;
let xWins = 0, oWins = 0, ties = 0;

const cells = document.querySelectorAll(".cell");
const turnDisplay = document.getElementById("turnDisplay");

function handleClick(e) {
  const index = e.target.getAttribute("data-index");
  if (board[index] !== "" || isGameOver) return;

  makeMove(index, currentPlayer);
  if (checkWinner(currentPlayer)) {
    endGame(`${currentPlayer} wins`);
    updateScore(currentPlayer);
    return;
  } else if (board.every(cell => cell !== "")) {
    endGame("Tie");
    ties++;
    updateScore();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurnDisplay();

  if (currentPlayer === "O") {
    const best = minimax(board, "O");
    setTimeout(() => {
      makeMove(best.index, "O");
      if (checkWinner("O")) {
        endGame("O wins");
        updateScore("O");
      } else if (board.every(cell => cell !== "")) {
        endGame("Tie");
        ties++;
        updateScore();
      } else {
        currentPlayer = "X";
        updateTurnDisplay();
      }
    }, 500);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].innerText = player;
  cells[index].classList.add(player.toLowerCase());
}

function updateTurnDisplay() {
  turnDisplay.innerText = `${currentPlayer} TURN`;
}

function endGame(msg) {
  isGameOver = true;
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  isGameOver = false;
  currentPlayer = "X";
  updateTurnDisplay();
  cells.forEach(cell => {
    cell.innerText = "";
    cell.classList.remove("x", "o");
  });
}

function updateScore(winner) {
  if (winner === "X") xWins++;
  else if (winner === "O") oWins++;
  document.getElementById("xWins").innerText = xWins;
  document.getElementById("oWins").innerText = oWins;
  document.getElementById("ties").innerText = ties;
}

function checkWinner(p) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern =>
    pattern.every(i => board[i] === p)
  );
}

function minimax(newBoard, player) {
  const availSpots = newBoard.map((v, i) => v === "" ? i : null).filter(i => i !== null);

  if (checkWin(newBoard, "X")) return { score: -10 };
  if (checkWin(newBoard, "O")) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if (player === "O") {
      const result = minimax(newBoard, "X");
      move.score = result.score;
    } else {
      const result = minimax(newBoard, "O");
      move.score = result.score;
    }

    newBoard[availSpots[i]] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function checkWin(board, player) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(combo => combo.every(i => board[i] === player));
}

document.querySelectorAll(".cell").forEach(cell =>
  cell.addEventListener("click", handleClick)
);
