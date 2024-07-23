const readline = require('readline-sync');

class Board {
    constructor() {
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));
        this.board[3][3] = '○';
        this.board[3][4] = '●';
        this.board[4][3] = '●';
        this.board[4][4] = '○';
        this.currentPlayer = '●';
        this.players = [];
    }
    
    printBoard() {
        const { black, white } = this.calculateScore();
        console.log('----------------------');
        console.log(`|  play with ${this.players[0]}  |`);
        console.log('----------------------\n');
        console.log('   a b c d e f g h');
        for (let i = 0; i < 8; i++) {
            let row = `${i + 1}| `;
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j] === null) {
                    if (this.isValidMove(i, j)) {
                        row += '* ';
                    } else {
                        row += '. ';
                    }
                } else {
                    row += this.board[i][j] + ' ';
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
        if (this.currentPlayer === '●') {
            this.currentPlayer = '○';
        }
        else {
            this.currentPlayer = '●';
        }
    }
    
    isValidMove(row, col) {
        if (this.board[row][col] !== null) return false;

        let opponent = this.currentPlayer === '●' ? '○' : '●';
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
        let valid = false;

        directions.forEach(([dRow, dCol]) => {
            let x = row + dRow;
            let y = col + dCol;
            let foundOpponent = false;
            while (x >= 0 && x < 8 && y >= 0 && y < 8 && this.board[x][y] === opponent) {
                x += dRow;
                y += dCol;
                foundOpponent = true;
            }
            if (foundOpponent && x >= 0 && x < 8 && y >= 0 && y < 8 && this.board[x][y] === this.currentPlayer) {
                valid = true;
            }
        });

        return valid;
    }
    
    placePiece(row, col) {
        if (!this.isValidMove(row, col)) {
            return false;
        }
        this.board[row][col] = this.currentPlayer;

        let opponent = this.currentPlayer === '●' ? '○' : '●';
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
                if (this.isValidMove(row, col)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    calculateScore() {
        let black = 0;
        let white = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j] === '●') {
                    black++;
                } else if (this.board[i][j] === '○') {
                    white++;
                }
            }
        }
        return { black, white };
    }
    
    gameOver() {
        const { black, white } = this.calculateScore();
        console.clear();
        this.printBoard();
        console.log('Game Over');
        if (black > white) {
            console.log('Player ● wins');
        } else if (white > black) {
            console.log('Player ○ wins');
        } else {
            console.log('Tie');
        }
    }
}

class Player {
    constructor(piece) {
        this.piece = piece;
    }
    
    playerInput(board) {
        while (true) {
            const move = readline.question(`Player ${board.currentPlayer}, enter your move (e.g., d3): `);
            if (!/^[a-h][1-8]$/.test(move)) {
                console.log('Invalid input format. Please enter a letter (a-h) followed by a number (1-8).');
                continue;
            }
            const col = move.charCodeAt(0) - 'a'.charCodeAt(0);
            const row = parseInt(move[1]) - 1;
            if (board.placePiece(row, col)) {
                console.clear();
                board.printBoard();
                break;
            } else {
                console.log('Invalid move. Please try again.');
            }
        }
    }
}
class Bot extends Player {
    playerInput(board) {
        let validMoves = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (board.isValidMove(row, col)) {
                    validMoves.push([row, col]);
                }
            }
        }

        if (validMoves.length > 0) {
            const [row, col] = validMoves[Math.floor(Math.random() * validMoves.length)];
            board.placePiece(row, col);
            console.clear();
            board.printBoard();
        }
    }
}

class Game {
    constructor() {
        this.board = new Board();
        this.players = [];
    }

    selectMode() {
        console.log('Select Game Mode:');
        console.log('1. Player vs Player');
        console.log('2. Player vs Bot');
        let mode = readline.question('Enter mode (1 or 2): ');

        while (mode !== '1' && mode !== '2') {
            console.log('Invalid selection. Please enter 1 or 2.');
            mode = readline.question('Enter mode (1 or 2): ');
        }

        if (mode === '1') {
            this.board.players = ['player'];
            this.players = [new Player('●'), new Player('○')];
        } else {
            this.board.players = ['bot   ']; 
            this.players = [new Player('●'), new Bot('○')];
        }
    }
    
    play() {
        console.clear();
        this.selectMode();
        while (true) {
            console.clear();
            this.board.printBoard();
            this.players.find(player => player.piece === this.board.currentPlayer).playerInput(this.board);
            if (!this.board.hasValidMoves() && !this.board.hasValidMoves(this.board.switchPlayer())) {
                this.board.gameOver();
                break;
            }
        }
    }
}

const game = new Game();
game.play();
