//Todo: Define html elements

const gameBoard = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

//Todo: Define game variables
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;
let currentScore = 0;

//Todo: Draw the game board
function draw() { 
    gameBoard.innerHTML = "";
    drawSnake();
    drawFood();
    updateScore();
}

//Todo: Draw the snake
function drawSnake() {
    snake.forEach((segment, index) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);

        if (index === 0) {
            snakeElement.style.backgroundColor = 'red';
        }

        gameBoard.appendChild(snakeElement);
    });
}

//Todo: Create a snake or food cube/div 
function createGameElement(elementType, className) {
    const element = document.createElement(elementType);
    element.className = className;
    return element;
}

//Todo: set the position of the snake food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

//Todo: Define Draw food function
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        gameBoard.appendChild(foodElement);
    }
}

//Todo: Generate food
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
}

//Todo: Moving the snake
function move() {
    const head = {...snake[0]};
    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;

    }

    snake.unshift(head);
 
    if (head.x === food.x && head.y === food.y) {
        currentScore++;
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); //Clear past interval
        gameInterval = setInterval(() => {
            move(); //Move first
            checkCollision();
            draw(); //Then draw again new position
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }

}

//Todo: Start the game
function startGame() {
    gameStarted = true; //Keep track of a running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw(); //Then draw again new position
    }, gameSpeedDelay);
}

//keypress event listener
function handleKeyPress(event) {
    if (
        (!gameStarted && event.code === 'Space') ||
        (!gameStarted && event.key === ' ') 
    ) {
        startGame();
    }else if (gameStarted && event.key === 'Escape') {
        stopGame();
    }else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
    console.log(gameSpeedDelay);
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    }else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    }else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    }else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    } 
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }
    
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'right'; 
    gameSpeedDelay = 200;
    updateHighScore();
    currentScore = 0;
    updateScore();
    stopGame();
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateScore() {
    //const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

function updateHighScore() {
    //const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}

