const readline = require('readline-sync');

class Board {
    constructor() {
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));
        this.board[3][3] = '○';
        this.board[3][4] = '●';
        this.board[4][3] = '●';
        this.board[4][4] = '○';
        this.currentPlayer = '●';
        this.player = ''; // 'Player' or 'bot'
    }

    printBoard() {
        const { black, white } = this.calculateScore(this.board);
        console.log('   a b c d e f g h');
        for (let i = 0; i < 8; i++) {
            let row = `${i + 1}| `;
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j]) {
                    row += this.board[i][j] + ' ';
                } else if (this.isValidMove([i, j])) {
                    row += '* ';
                } else {
                    row += '. ';
                }
            }
            console.log(row);
        }
        console.log('-------------------');
        console.log(`Current Player: ${this.currentPlayer}`);
        console.log(`● : ${black} | ○ : ${white}`);
        console.log('-------------------');
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === '●' ? '○' : '●';
    }

    isValidMove([row, col]) {
        if (this.board[row][col] !== null) return false;

        const opponent = this.currentPlayer === '●' ? '○' : '●';
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];

        return directions.some(([dRow, dCol]) => {
            let x = row + dRow;
            let y = col + dCol;
            let foundOpponent = false;
            while (x >= 0 && x < 8 && y >= 0 && y < 8 && this.board[x][y] === opponent) {
                x += dRow;
                y += dCol;
                foundOpponent = true;
            }
            return foundOpponent && x >= 0 && x < 8 && y >= 0 && y < 8 && this.board[x][y] === this.currentPlayer;
        });
    }

    placePiece([row, col]) {
        if (!this.isValidMove([row, col])) return false;

        this.board[row][col] = this.currentPlayer;
        const opponent = this.currentPlayer === '●' ? '○' : '●';
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];

        directions.forEach(([dRow, dCol]) => {
            let x = row + dRow;
            let y = col + dCol;
            let piecesToFlip = [];

            while (x >= 0 && x < 8 && y >= 0 && y < 8 && this.board[x][y] === opponent) {
                piecesToFlip.push([x, y]);
                x += dRow;
                y += dCol;
            }
            if (x >= 0 && x < 8 && y >= 0 && y < 8 && this.board[x][y] === this.currentPlayer) {
                piecesToFlip.forEach(([pRow, pCol]) => {
                    this.board[pRow][pCol] = this.currentPlayer;
                });
            }
        });

        this.switchPlayer();
        return true;
    }

    hasValidMoves() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.isValidMove([row, col])) {
                    return true;
                }
            }
        }
        return false;
    }

    calculateScore() {
        let black = 0, white = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === '●') black++;
                else if (this.board[row][col] === '○') white++;
            }
        }
        return { black, white };
    }

    gameOver() {
        const { black, white } = this.calculateScore();
        console.log('Game Over');
        console.log(`Black: ${black} | White: ${white}`);
        if (black > white) console.log('Black wins!');
        else if (white > black) console.log('White wins!');
        else console.log('It\'s a tie!');
    }
}

class Player {
    constructor(playerPiece) {
        this.playerPiece = playerPiece;
    }

    playerInput(board) {
        while (true) {
            const move = readline.question(`Player ${board.currentPlayer}, enter your move (e.g., d3): `);
            if (!/^[a-h][1-8]$/.test(move)) {
                console.log('Invalid input. Please enter a letter (a-h) followed by a number (1-8).');
                continue;
            }
            const col = move.charCodeAt(0) - 'a'.charCodeAt(0);
            const row = parseInt(move[1]) - 1;
            if (board.placePiece([row, col])) {
                break;
            } else {
                console.log('Invalid move. Please try again.');
            }
        }
    }
}

class Bot {
    constructor(botPiece) {
        this.botPiece = botPiece;
        this.difficulty = 'easy';
        this.scoreBoard = [
            [100, -20, 10,  5,  5, 10, -20, 100],
            [-20, -50,  -2, -2, -2, -2, -50, -20],
            [ 10,  -2,   1,  1,  1,  1,  -2,  10],
            [  5,  -2,   1,  1,  1,  1,  -2,   5],
            [  5,  -2,   1,  1,  1,  1,  -2,   5],
            [ 10,  -2,   1,  1,  1,  1,  -2,  10],
            [-20, -50,  -2, -2, -2, -2, -50, -20],
            [100, -20, 10,  5,  5, 10, -20, 100]
        ];
    }

    bestMove(board) {
        const validMoves = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (board.isValidMove([row, col])) {
                    validMoves.push({row, col, score: this.scoreBoard[row][col]});
                }
            }
        }

        validMoves.sort((a, b) => b.score - a.score);

        const topMoves = validMoves.slice(0, Math.min(5, validMoves.length));
        const selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];

        return [selectedMove.row, selectedMove.col];
    }
}

class Game {
    constructor() {
        this.board = new Board();
    }

    selectMode() {
        console.log('Select Game Mode:');
        console.log('1. Player vs Player');
        console.log('2. Player vs Bot(Randome Move)');
        let mode = readline.question('Enter mode (1 or 2): ');
        while (mode !== '1' && mode !== '2') {
            console.log('Invalid selection. Please enter 1 or 2.');
            mode = readline.question('Enter mode (1 or 2): ');
        }
        this.board.player = mode === '1' ? 'Player' : 'bot';
    }

    play() {
        this.selectMode();
        const player1 = new Player('●');
        const player2 = this.board.player === 'Player' ? new Player('○') : new Bot('○');

        while (true) {
            console.clear();
            this.board.printBoard();
            if (this.board.currentPlayer === '●') {
                player1.playerInput(this.board);
            } else {
                if (this.board.player === 'Player') {
                    player2.playerInput(this.board);
                } else {
                    const botMove = player2.bestMove(this.board);
                    this.board.placePiece(botMove);
                }
            }
            
            if (!this.board.hasValidMoves()) {
                this.board.switchPlayer();
                if (!this.board.hasValidMoves()) {
                    this.board.gameOver();
                    break;
                }
            }
        }
    }
}

const game = new Game();
game.play();