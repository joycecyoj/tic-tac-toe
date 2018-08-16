const router = require('express').Router();

module.exports = router;

class Game {
  constructor() {
    this.board = '+++++++++';
    this.player = 'player';
  }
}

router.post('/game', (req, res, next) => {
  try {
    const game = new Game();
    const player = req.body.player;
    let positionIdx;
    if (player === this.player) {
      res.status(201).send(changePlusToSpace(game.board));
    } else {
      positionIdx = getPosition(game.board);
      res.status(201).send(changePlusToSpace(move(game.board, positionIdx)));
      this.player = 'player';
    }
  } catch (error) {
    next(error);
  }
});


router.get('/', (req, res, next) => {
  try {
    let positionIdx;
    const tempBoard = req.query.board;

    if (!checkWinner(tempBoard, 'player')) {
      positionIdx = getPosition(tempBoard);
      let newBoard = changePlusToSpace(move(tempBoard, positionIdx))
      if (checkWinner(newBoard, 'computer')) {
        res.write(newBoard);
        res.write(' Computer Wins!')
        res.end();
      } else {
        res.send(newBoard);
      }
    } else {
      res.send('You Won!');
    }
  } catch (error) {
    next(error);
  }
});

router.use((req, res, next) => {
  const err = new Error('API route not found!');
  err.status = 404;
  next(err);
});

function changePlusToSpace(str) {
  let final = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '+') {
      final += ' ';
    } else {
      final += str[i];
    }
  }
  return final;
}

function move(board, positionIdx) {
  let marker = 'o';
  let firstPartBoard = board.slice(0, positionIdx);
  let secondPartBoard = board.slice(positionIdx + 1);
  let newBoard = firstPartBoard + marker + secondPartBoard;

  console.log('newBoard from move---', newBoard);
  return newBoard;
}

function getPosition(board) {
  let openPositionsIdxArr = [];
  let positionIdx;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '+') {
      openPositionsIdxArr.push(i);
    }
  }
  positionIdx = getRandomIdx(0, openPositionsIdxArr.length);
  return openPositionsIdxArr[positionIdx];
}

function getRandomIdx(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}


function checkWinner(board, player) {
  let marker;
  if (player === 'player') {
    marker = 'x';
  } else {
    marker = 'o';
  }

  let selectionsToCheck = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === marker) {
      selectionsToCheck.push(i);
    }
  }

  if (selectionsToCheck.length < 3) {
    return false;
  }

  let winCombo = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let found = 0;

  for (let i = 0; i < winCombo.length; i++) {
    let combo = winCombo[i];

    for (let j = 0; j < selectionsToCheck.length; j++) {
      if (winCombo[i].indexOf(selectionsToCheck[j]) !== -1) {
        found += 1;
        console.log('found:', found, 'j:', j, selectionsToCheck[j]);
      }
      if (found === 3) {
        return true;
      }
    }
    found = 0;
  }
}
