function is_move_left(board){
    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            if(board[i][j] === 0){
                return true
            }
        }
    }
    return false
}

function evaluation(board){
    for(let row=0; row<3; row++){
        if(board[row][0] === board[row][1] && board[row][1] === board[row][2]){
            if(board[row][0] === -1){
                return -10
            } else if (board[row][0] === 1){
                return 10
            }
        }
    }

    for(let col=0; col<3; col++){
        if(board[0][col] === board[1][col] && board[1][col] === board[2][col]){
            if(board[0][col] === -1){
                return -10
            } else if (board[0][col] === 1){
                return 10
            }
        }
    }

    if(board[0][0] === board[1][1] && board[1][1] === board[2][2]){
        if(board[0][0] === -1){
            return -10
        } else if(board[0][0] === 1){
            return 10
        }
    }

    if(board[0][2] === board[1][1] && board[1][1] === board[2][0]){
        if(board[0][2] === -1){
            return -10
        } else if(board[0][2] === 1){
            return 10
        }
    }

    return 0
}


function minimax(board, depth, isMax){
    let score = evaluation(board);

    if(score === -10){ return score+depth }
    if(score === 10){ return score-depth }
    if(!is_move_left(board)) { return 0 }

    if(isMax){
        let best = -1000
        
        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                if(board[i][j] === 0){
                    board[i][j] = 1
                    best = Math.max(best, minimax(board, depth+1, false))
                    board[i][j] = 0
                }
            }
        }
        return best
    } else{
        let best = 1000

        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                if(board[i][j] === 0){
                    board[i][j] = -1
                    best = Math.min(best, minimax(board, depth+1, true))
                    board[i][j] = 0
                }
            }
        }
        return best
    }
}

function best_move(board){
    //if(!is_move_left){return null }
    let bestScore = -10000
    let bestMove = [-1, -1]

    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            if(board[i][j] === 0){
                board[i][j] = 1
                moveScore = minimax(board, 0, false)
                board[i][j] = 0

                if(moveScore > bestScore){
                    bestScore = moveScore
                    bestMove[0]= i
                    bestMove[1] = j
                }
            }
        }
    }
    return bestMove
}


var cvs = document.querySelector("#canvas")
var ctx = cvs.getContext("2d")

var width = cvs.width
var height = cvs.height

const states = {
    MENU: 0,
    PLAYING: 1
}
const turns = {
    PLAYER: -1,
    MINMAX: 1
}
var state = states.PLAYING
var turn = turns.PLAYER
var game_finished = false

var board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
var occupiedCellInde

function setupBoard(){
    for(let i=1; i<3; i++){
        ctx.beginPath()
        ctx.moveTo(100*i, 0)
        ctx.lineTo(100*i, height)
        ctx.moveTo(0, height*i/3)
        ctx.lineTo(width, height*i/3)
        ctx.stroke()
    }
}

function getMousePosition(canvas, event){
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const cellId = [Math.floor(y/(height/3)), Math.floor(x/100)]
    return cellId
}


function drawCircle(canvas, i, j){
    ctx.lineWidth = 16
    ctx.beginPath()
    ctx.strokeStyle = 'red';
    ctx.arc(100*j+50, 116.6*i+58.3, 30, 0, Math.PI*2, false);
    ctx.stroke()
    ctx.lineWidth = 1
}

function drawTick(canvas, i, j){
    let offsetX = 100*j
    let offsetY = 116.6*i
    let xPoints = [10, 25, 80, 75, 25, 17]
    let yPoints = [58.3, 100, 20, 17, 70, 50]
    ctx.fillStyle = 'green'
    ctx.beginPath()
    ctx.moveTo(offsetX+xPoints[0], offsetY+yPoints[0])
    for (let a=1; a<xPoints.length; a++){
        ctx.lineTo(offsetX+xPoints[a], offsetY+yPoints[a])
    }
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = 'white'
}


function checkWinner(board){
    ctx.font = '64px serif';
    ctx.fontWeight = 'bolder';
    ctx.fillStyle = 'black';
    currentScore = evaluation(board)
    if(currentScore === -10){
        state = states.MENU
        ctx.fillText("You Won", 50, 150)
        return true
    } else if(currentScore === 10){
        state = states.MENU
        ctx.fillText("You lose", 50, 150)
        return true
    }
    if (!is_move_left(board)){
        state = states.MENU
        ctx.fillText("Draw!", 50, 150)
        return true
    }
    return false
}
setupBoard()




cvs.addEventListener('mousedown', (e) => {
    game_finished = checkWinner(board)
    if(game_finished){ return }
    if(state === states.PLAYING){
        let cellId = getMousePosition(cvs, e)
        if(board[cellId[0]][cellId[1]] === 0){
            if(turn === turns.PLAYER){
                drawTick(cvs, cellId[0], cellId[1])
                board[cellId[0]][cellId[1]] = -1
                turn = turns.MINMAX           
                game_finished = checkWinner(board)
                if(game_finished){ return }
                let minimax_cell = best_move(board)
                drawCircle(cvs, minimax_cell[0], minimax_cell[1])
                board[minimax_cell[0]][minimax_cell[1]] = 1
                turn = turns.PLAYER
                game_finished = checkWinner(board)
                if(game_finished){ return }
            }
        }
    }
})

function restartGame(){
    location.reload()
}