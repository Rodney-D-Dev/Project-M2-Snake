
//Walls Layout in an array of # strings
let levelOne = [
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '##############################',
]
//varibles for Play area tile sizes. width * height resulting in grid size;
let width = 30;
let height = 30;
let tileSize = 20;

//Drawing canvas on screen and adjusting size by width * height and setting border color.
const rootstyle = getComputedStyle(document.body);
const gameBoard = document.getElementById("gameBoard");
const contx = gameBoard.getContext("2d");
gameBoard.height = height * tileSize;
gameBoard.width = width * tileSize;
gameBoard.style.border = `1px solid ${rootstyle.getPropertyValue('--primary-color')}`;

//Game Menus acessed html div elements by Id 
const startUI = document.getElementById("startMenu");
const gameOverUI = document.getElementById("gameOverMenu");

//acessing html score,level and lives display
const scoreDis = document.getElementById("score");
const levelDis = document.getElementById("level");
const livesDis = document.getElementById("lives");

//Sound effects adding audio from sounds folder
const eatEffect = new Audio("assets/sounds/carrotnom-92106.mp3");
const hitEffect = new Audio("assets/sounds/punch-2-37333.mp3");

// Stats
let score = 0;
let level = 1;
let lives = 3;

let currentlives;

//Snake varibles 
let snake = {x:120, y:200}; // snake start point
let snakeBody = [];
let snakeSpeed = 10;

//Food Varibles
let food = randomPos();;

//walls array and wall object with x and y cords  
let walls = [];
let wall = {
    x: tileSize,
    y: tileSize
};

//input varible to move snake and store last input
let inputDr = { x: 0, y: 0 };
let lastInputDr = { x: 0, y: 0 };

//helper varibles to be used with setInterval()
let fPS = 1000 / snakeSpeed;
let gameLoop;

//varible to help with game state
let isPaused = false;
let isGameOver = false;

update(); // called here to allow input and game to be displayed.

/**
 * Game Start funtion Handles Game start and sets of Update to run perframe
 */
function gameStart() {
    hideMenu(startUI);
    inputDr.x = 0;
    inputDr.y = 0;
    snakeBody.length = 1;
    snake = {x:120, y:220};
    food = randomPos();
    gameLoop = setInterval(update, fPS);
    if (lives <= 0 ) {
        lives = 3;
    }
}
/**
 * Update function Handles anything that needs to be updated evry frame.
 */
function update() {
    if (!isPaused) {
        moveSnake();
        collision();
        currentlives = lives;
        drawGame();
    }
    input();
}
/**
 * Draw fuction Handles anything that needs to be drawn to canvas.
 */
function drawGame() {
    contx.fillStyle = "white";
    contx.fillRect(0, 0, gameBoard.width, gameBoard.height);
    drawStats();
    drawMap();
    drawFood();
    drawSnake();
}
function drawStats() {
    scoreDis.innerHTML = `score:${score}`;
    levelDis.innerHTML = `Level:${level}`;
    for (i = 0; i <= lives; i++) {
        let heart = "&#128150";
        livesDis.innerHTML = `${heart.repeat(i)}`;
    }

}
/**
 * Create Map Function to generate walls out of # strings by looping throgh array of strings 
 * @param {Array [string]}
 */
function createMap(map) {
    for (let y = 0; y < map.length; y++) {
        const row = map[y];
        for (let x = 0; x < row.length; x++) {
            const char = row[x];
            if (char === '#') {
                walls.push({ x: x * wall.x, y: y * wall.y });
            }
        }
    }
}
function drawMap() {
    createMap(levelOne); //create walls out of levlOne array
    for (let i = 0; i < walls.length; i++) {
        const wall = walls[i];
        contx.fillStyle = "#ffc0cb"
        contx.fillRect(wall.x, wall.y, tileSize, tileSize)
    }
}
function drawFood() {
    contx.fillStyle = "brown";
    contx.fillRect(food.x, food.y, tileSize, tileSize);
}
function drawSnake() {
    contx.fillStyle = "red";
    contx.fillRect(snake.x, snake.y, tileSize, tileSize);
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snake.x, snake.y];
    }
    for (let i = 0; i < snakeBody.length; i++) {
        contx.fillStyle = (i <= 0) ? "red" : "green";
        contx.fillRect(snakeBody[i][0], snakeBody[i][1], tileSize, tileSize);
    }

}
/**
 * Move Snake function to update snake movement
 */
function moveSnake() {

    snake.x += inputDr.x * tileSize;
    snake.y += inputDr.y * tileSize;

}
/**
 * RandomPos hellper function to generate random position on map
 * used for snake and food positioning
 */
function randomPos() {
    return {
        x: Math.floor(Math.random() * height ) * tileSize, 
        y: Math.floor(Math.random() * width ) * tileSize
    }
}
/**
 * Input function add event when ever key is pressed or buttons are clicked 
 */
function input() {
    lastInputDr = inputDr;
    document.body.addEventListener("keydown", event => {
        switch (event.key) {
            case "ArrowUp":
                if (lastInputDr.y !== 0) break;
                inputDr = { x: 0, y: -1 };
                break;
            case "ArrowDown":
                if (lastInputDr.y !== 0) break;
                inputDr = { x: 0, y: 1 };
                break;
            case "ArrowLeft":
                if (lastInputDr.x !== 0) break;
                inputDr = { x: -1, y: 0 };
                break;
            case "ArrowRight":
                if (lastInputDr.x !== 0) break;
                inputDr = { x: 1, y: 0 };
                break;
            case " ":
                if (!isPaused) {
                    pauseGame();
                } else {
                    resetGame();
                }
                break;

        }
    })

    document.body.addEventListener("click", event => {
        switch (event.target.id) {
            case "up":
                if (lastInputDr.y !== 0) break;
                inputDr = { x: 0, y: -1 };
                break;
            case "down":
                if (lastInputDr.y !== 0) break;
                inputDr = { x: 0, y: 1 };
                break;
            case "left":
                if (lastInputDr.x !== 0) break;
                inputDr = { x: -1, y: 0 };
                break;
            case "right":
                if (lastInputDr.x !== 0) break;
                inputDr = { x: 1, y: 0 };
                break;
            case "startbtn":
                console.log("start the Game!");
                hideMenu(startUI);
                gameStart();
                break;
            case "playAgainbtn":
                hideMenu(gameOverUI);
                isGameOver = false;
                clearInterval(gameLoop);
                gameStart();
                break;
        }
    })
}
/**
 * Collision function to detect any collision with snake,wall and food.
 */
function collision() {
    //self collisions
    for (let i = 0; i < snakeBody.length - 1; i++) {
        if (snake.x === snakeBody[i][0] && snake.y === snakeBody[i][1]) {
            lives--;
            hitEffect.volume = 0.5;
            hitEffect.play();
            resetGame();
        }
    }

    //food collisions
    if (snake.x === food.x && snake.y === food.y) {
        snakeBody.unshift({ ...snakeBody });
        eatEffect.volume = 0.5;
        eatEffect.play();
        food = randomPos();
        score++
    }
    // wall collisions
    for (let i = 0; i < walls.length; i++) {
        const wall = walls[i];
        // if snake hits wall
        if (snake.x === wall.x && snake.y === wall.y) {
            // loose live and reset level.
            lives--;
            hitEffect.volume = 0.5;
            hitEffect.play();
            resetGame();
        }
        //detect if food is generated on snake or wall
        if (food.x === snake.x && food.y === snake.y || food.x === wall.x && food.y === wall.y) {
            food = randomPos();
        }

    }
}

function resetGame() {
    
    if (lives <= 0) {
        isGameOver = true;
        showMenu(gameOverUI);
    } else if (lives >= 0) {
        //set score back to 0
        score = 0;
        //reset snake 
        snakeBody.length = 1;
        inputDr.x = 0;
        inputDr.y = 0;
        snake = {x:120, y:220};
        food = randomPos();
        isPaused = false;
    }

}

function muteAudio() {
    let backgroundAudio = document.getElementById("bgAudio");
    backgroundAudio.muteAudio = !backgroundAudio.muteAudio;
}

function showMenu(menu) {
    menu.style.visibility = "visible";
}

function hideMenu(menu) {
    menu.style.visibility = "hidden";
}
