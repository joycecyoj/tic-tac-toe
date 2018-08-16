const router = require('express').Router();

module.exports = router;

class Game {
  constructor() {
    this.board = '+++++++++';
    this.player = 'player';
  }
}

// /api
router.post('/game', (req, res, next) => {
  try {
    const game = new Game();
    const player = req.body.player;
    let positionIdx;
    if (player === this.player) {
      // send empty board
      res.status(201).send(changePlusToSpace(game.board));
    } else {
      positionIdx = getPosition(game.board);
      res.status(201).send(changePlusToSpace(move(game.board, positionIdx)));
      // move(game.board, positionIdx)
      this.player = 'player';
    }
  } catch (error) {
    next(error);
  }
});


// /api/board?board=+xxo++o++
router.get('/board', (req, res, next) => {
  try {
    let positionIdx;
    const tempBoard = req.query.board;
    console.log('tempboard', tempBoard);

    if (!checkWinner(tempBoard, 'player')) {
      console.log('checked players move');

      positionIdx = getPosition(tempBoard);
      let newBoard = changePlusToSpace(move(tempBoard, positionIdx))
      // move(tempBoard, positionIdx)
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

// Helper functions
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
  // slice board add marker
  console.log('board received in move', board);
  console.log('positonIdx received in move', positionIdx);
  let marker = 'o';
  let firstPartBoard = board.slice(0, positionIdx);
  let secondPartBoard = board.slice(positionIdx + 1);
  let newBoard = firstPartBoard + marker + secondPartBoard;

  // console.log('board 1---', firstPartBoard);
  // console.log('board 2---', secondPartBoard);

  console.log('newBoard from move---', newBoard);
  return newBoard;
}

// returns random position based on open spots on board
function getPosition(board) {
  console.log('board in getPosition---', board);
  let openPositionsIdxArr = [];
  let positionIdx;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '+') {
      openPositionsIdxArr.push(i);
    }
  }
  console.log('openPositionsIdxArr', openPositionsIdxArr);
  positionIdx = getRandomIdx(0, openPositionsIdxArr.length);
  console.log('positionIdx------', positionIdx);
  return openPositionsIdxArr[positionIdx];
}

function getRandomIdx(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}


function checkWinner(board, player) {
  console.log('board in check winner', board);
  console.log('player to check win', player);
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
  console.log('selectionsToCheck in checkWinner', selectionsToCheck);

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
