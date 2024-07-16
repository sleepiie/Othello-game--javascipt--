console.clear();
let readline = require('readline-sync');
let board = Array(8).fill(null).map(() => Array(8).fill(null))
board[3][3] = '○';
board[3][4] = '●';
board[4][3] = '●';
board[4][4] = '○';

let currentPlayer = '●';

function printBoard(board ,currentPlayer ) {
    const { black, white } = calculateScore(board);
    console.log('  a b c d e f g h');
    for (let i = 0; i < 8; i++) {
        let row = `${i + 1} `;
        for(let j =0; j<8;j++){
            if(board[i][j] === null){
                if (isValidMove(board,i,j,currentPlayer)){
                    row += '* ';
                }
                else{
                    row += '. ';
                }

            }
            else{
                row += board[i][j] + ' ';
            }
        }
        console.log(row);
    }
    console.log('-------------------');
    console.log(`Current Player: ${currentPlayer}`);
    console.log(`● : ${black} | ○ : ${white}`);
    console.log('-------------------');
}
function switchPlayer(currentPlayer){
    if(currentPlayer === '●'){
        return '○';
    }
    else{
        return '●';
    }
}
function isValidMove(board , row , col , player){
    if (board[row][col] !== null){
        return false
    }
    let opponent
    if(player === '●'){
        opponent = '○';
    }
    else{
        opponent = '●';
    }
    const direction = [[-1, 0], [1, 0], [0, -1], [0, 1],
                        [-1, -1], [-1, 1], [1, -1], [1, 1]];
    let valid = false;
    direction.forEach(([dRow,dCol]) => {
        let x = row + dRow;
        let y = col + dCol;
        let foundOpponent = false;
        while (x >=0 && x<8 && y >= 0 && y<8 && board[x][y]===opponent){
            x+= dRow;
            y+= dCol;
            foundOpponent = true;
        }
        if (foundOpponent && x >= 0 && x<8 && y>=0 && y<8 && board[x][y]===player){
            valid = true;
        }
    });
    return valid;
}
function placePiece(board , row , col , player){
    if(!isValidMove(board,row,col,player)){
        return false;
    }
    board[row][col] = player;

    let opponent
    if(player === '●'){
        opponent = '○';
    }
    else{
        opponent = '●';
    }
    const direction = [[-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]];
    direction.forEach(([dRow,dCol]) => {
        let x = row + dRow;
        let y = col + dCol;
        let piecesToFlip = [];

        while (x>=0 && x<8 && y >=0 && y<8 && board[x][y]===opponent){
            piecesToFlip.push([x,y]);
            x+= dRow;
            y+= dCol;
        }
        if (x>=0 && x<8 && y>=0 && y<8 && board[x][y]===player){
            piecesToFlip.forEach(([pRow,pCol]) => {
                board[pRow][pCol] = player;
            });
        }

    });
    return true;
}
function hasValidMoves(board , player){
    for (let row=0 ; row<8 ; row++){
        for(let col=0 ; col<8 ; col++ ){
            if(isValidMove(board ,row ,col ,player)){
                return true
            }
        }
    }
    return false;
}
function calculateScore(board) {
    let black = 0;
    let white = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === '●') {
                black++;
            } else if (board[i][j] === '○') {
                white++;
            }
        }
    }
    return { black, white };
}
function askForMove(){
    while(true){
        const move = readline.question(`Player ${currentPlayer}, enter your move (e.g., d3): `);
        if (!/^[a-h][1-8]$/.test(move)) {
            console.log('Invalid input format. Please enter a letter (a-h) followed by a number (1-8).');
            continue;
        }
        const col = move.charCodeAt(0) - 'a'.charCodeAt(0);
        const row = parseInt(move[1]) - 1;
        if (placePiece(board,row,col,currentPlayer)){
            currentPlayer = switchPlayer(currentPlayer);
            if(!hasValidMoves(board,currentPlayer)){
                currentPlayer = switchPlayer(currentPlayer);
                if(!hasValidMoves(board,currentPlayer)){
                    console.log('Game Over');
                    const { black, white } = calculateScore(board);
                    if(black>white){
                        console.log('● wins');
                    }
                    else if(black<white){
                        console.log('○ wins');
                    }
                    else{
                        console.log('Draw');
                    }
                }
            }
            console.clear();
            printBoard(board,currentPlayer);
        }
        else{
            console.log('Invalid move. Try again.');
        }
    }
    
}

printBoard(board,currentPlayer);
askForMove();
