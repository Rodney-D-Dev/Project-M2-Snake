
//Map
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
// varibles to keep of grid/map size
let width = 30;
let height = 30;
let tileSize = 15;
// Drawing canvas on screen and adjusting size by width * height
const rootstyle = getComputedStyle(document.body);
const gameBoard = document.getElementById("gameBoard");
const contx = gameBoard.getContext("2d");
gameBoard.height = height * tileSize;
gameBoard.width = width * tileSize;
gameBoard.style.border = `1px solid ${rootstyle.getPropertyValue('--primary-color')}`;

//Game Menus 
const startUI = document.getElementById("startMenu");
const gameOverUI = document.getElementById("gameOverMenu");

const scoreDis = document.getElementById("score");
const levelDis = document.getElementById("level");
const livesDis = document.getElementById("lives");

//Sound effects
let eatEffect = new Audio("assets/sounds/carrotnom-92106.mp3");
let hitEffect = new Audio("assets/sounds/punch-2-37333.mp3");

// Stats
let score = 0;
let level = 1;
let lives = 3;

let currentlives;

//Snake varibles 
let snake = randomPos(); // snake start point
let snakeBody = [];
let snakeSpeed = 10;
//Food Varibles
let food = randomPos();;

//walls 
let walls = [];
let wall = {
    x: tileSize,
    y: tileSize
};

//directinal control
let inputDr = { x: 0, y: 0 };
let lastInputDr = { x: 0, y: 0 };


let fPS = 1000 / snakeSpeed;
let gameLoop = 0;

let isPaused = false;
let isGameOver = false;


update();
input();

function gameStart() {
    hideMenu(startUI);
    inputDr.x = 0;
    inputDr.y = 0;
    snakeBody.length = 1;
    snake = randomPos();
    food = randomPos();
    gameLoop = setInterval(update, fPS);
    if (lives <= 0 ) {
        lives = 3;
        drawGame();
    }

}
function update() {
    if (!isPaused) {
        moveSnake();
        collision();
        currentlives = lives;
    }
    drawGame();

}

function drawGame() {
    contx.fillStyle = "white";
    contx.fillRect(0, 0, gameBoard.width, gameBoard.height);
    createMap(levelOne);//Drawing Walls on canvas 
    drawStats();
    drawMap();
    drawFood();
    drawSnake();
}
function drawStats() {
    scoreDis.innerHTML = `score:${score}`;
    levelDis.innerHTML = `Level:${level}`;
    for (i = 0; i <= currentlives; i++) {
        let heart = "&#128150";
        livesDis.innerHTML = `${heart.repeat(i)}`;
    }

}
/**
 * 
 * 
 * @param{Array<string>}
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
    for (let i = 0; i < walls.length; i++) {
        const wall = walls[i];
        contx.fillStyle = "#ffc0cb"
        contx.fillRect(wall.x, wall.y, tileSize, tileSize)
    }
}
function drawFood() {
    //Drawing Food on Canvas before snake for collision detection
    contx.fillStyle = "brown";
    contx.fillRect(food.x, food.y, tileSize, tileSize);
}
function drawSnake() {
    //Drawing Snake on Canvas
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
// snake movement
function moveSnake() {

    snake.x += inputDr.x * tileSize;
    snake.y += inputDr.y * tileSize;

}
/**hellper function to generate random position on map
 * used for snake and food pos
 */
function randomPos() {
    return {
        x: Math.floor(Math.random() * height) * tileSize,
        y: Math.floor(Math.random() * width) * tileSize
    }
}
// user input for game controll
function input() {
    lastInputDr = inputDr;
    document.body.addEventListener("keydown", event => {
        switch (event.key) {
            case "ArrowUp":
                console.log("pressed up");
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
                    resumeGame();
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
                currentlives = lives;
                gameStart();
                break;
            case "playAgainbtn":
                hideMenu(gameOverUI);
                isGameOver = false;
                currentlives = lives;
                gameStart();
                break;
        }
    })
}

function collision() {
    //self collisions
    for (let i = 0; i < snakeBody.length - 1; i++) {
        if (snake.x === snakeBody[i][0] && snake.y === snakeBody[i][1]) {
            lives--;
            currentlives = lives;
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
            currentlives = lives;
            hitEffect.volume = 0.5;
            hitEffect.play();
            resetGame();
        }
        //detect if food is generated on snake or wall
        if (food.x === snake.x && food.y === snake.y || food.x === wall.x && food.y === wall.y) {
            food = randomPos();
            eatEffect.volume = 0.5;
            eatEffect.play();
        }

    }
}
function pauseGame() {
    isPaused = true;
}
function resumeGame() {
    isPaused = false;
}
function resetGame() {
    
    if (currentlives <= 0) {
        isGameOver = true;
        showMenu(gameOverUI);
        lives = 3;
        currentlives = lives;
        isPaused = true;
    } else if (currentlives >= 0) {
        //set score back to 0
        score = 0;
        //reset snake 
        snakeBody.length = 1;
        inputDr.x = 0;
        inputDr.y = 0;
        snake = randomPos();
        food = randomPos();
        isPaused = false;
    }

}


/**
 * Audio background music
 */
function muteAudio() {
    let backgroundAudio = document.getElementById("bgAudio");
    backgroundAudio.muteAudio = !backgroundAudio.muteAudio;
}

/**
 * Menu Functions 
 */

function showMenu(menu) {
    menu.style.visibility = "visible";
}

function hideMenu(menu) {
    menu.style.visibility = "hidden";
}
