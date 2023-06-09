
//Walls Layout in an array of # strings
let levelOne = [
    '####################',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '####################',
];
//varibles for Play area tile sizes. width * height resulting in grid size;
let width = 20;
let height = 20;
let tileSize = 20;

//Drawing canvas on screen and adjusting size by width * height and accessing css custom varibles.
const rootstyle = getComputedStyle(document.body);
const gameBoard = document.getElementById("gameBoard");
const contx = gameBoard.getContext("2d");
gameBoard.height = height * tileSize;
gameBoard.width = width * tileSize;

//Game Menus acessed html div elements by Id 
const startUI = document.getElementById("startMenu");
const gameOverUI = document.getElementById("gameOverMenu");
const statUI = document.getElementById("gameStatArea");

//acessing html score and lives display
const scoreDis = document.getElementById("score");
const livesDis = document.getElementById("lives");

//Sound effects adding audio from sounds folder
const eatEffect = new Audio("assets/sounds/carrotnom-92106.mp3");
const hitEffect = new Audio("assets/sounds/punch-2-37333.mp3");

// Stats
let score = 0;
let lives = 3;

//Snake varibles 
let snake = { x: 120, y: 200 }; // snake start point
let snakeBody = [];
let snakeSpeed = 12;

//Food Varibles
let food = randomPos();


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

input(); // called here to allow input before game start.
/**
 * Game Start funtion Handles Game start and sets off Update to run perframe
 */
function startGame() {
    isPaused = false;
    inputDr.x = 0;
    inputDr.y = 0;
    snakeBody.length = 1;
    snake = { x: 120, y: 220 };
    food = randomPos();
    if (lives <= 0) {
        lives = 3;
    }
    gameLoop = setInterval(update, fPS);
}
/**
 * Update function Handles anything that needs to be updated evry frame.
 */
function update() {
    if (!isPaused) {
        moveSnake();
        collision();
        drawGame();
    }
    input();
}
/**
 * Draw Game fuction Handles anything that needs to be drawn to canvas.
 */
function drawGame() {
    contx.fillStyle = `${rootstyle.getPropertyValue('--primary-color')}`;
    contx.fillRect(0, 0, gameBoard.width, gameBoard.height);
    drawStats();
    drawMap();
    drawFood();
    drawSnake();
}
/**
 * Draw Stats function to draw score and lives
 */
function drawStats() {
    scoreDis.innerHTML = `🏆:${score}`;
    for (let i = 0; i <= lives; i++) {
        let heart = "&#128150";
        livesDis.innerHTML = `${heart.repeat(i)}`;
    }
    gameOverUI.children[1].innerHTML = `🏆${score}`;

}
/**
 * Create Map Function to generate walls
 * by creating an empty map and then iterating through the length of the map to create rows.
 * Then iterating through each character in the string array, checking if it is a # symbol, and adding that wall to the array of walls on that row. 
 * @param {string []} map 
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
/**
 * Draw Map function to draw map
 */
function drawMap() {
    createMap(levelOne);
    for (let i = 0; i < walls.length; i++) {
        const wall = walls[i];
        contx.fillStyle = `${rootstyle.getPropertyValue('--walls-color')}`;
        contx.fillRect(wall.x, wall.y, tileSize, tileSize);
    }
}
/**
 * Draw Food function to draw food
 */
function drawFood() {
    contx.fillStyle = `${rootstyle.getPropertyValue('--food-color')}`;
    contx.fillRect(food.x, food.y, tileSize, tileSize);
}
/**
 * Draw Snake function to draw snake
 */
function drawSnake() {
    contx.fillStyle = `${rootstyle.getPropertyValue('--snakeHead-color')}`;
    contx.fillRect(snake.x, snake.y, tileSize, tileSize);
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snake.x, snake.y];
    }
    for (let i = 0; i < snakeBody.length; i++) {
        contx.fillStyle = (i <= 0) ? `${rootstyle.getPropertyValue('--snakeHead-color')}` : `${rootstyle.getPropertyValue('--snakeBody-color')}`;
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
 * used for food positioning
 */
function randomPos() {
    return {
        x: Math.floor(Math.random() * height) * tileSize,
        y: Math.floor(Math.random() * width) * tileSize
    };
}
/**
 * Input function to add eventListner when key is pressed or button is clicked 
 */
function input() {
    lastInputDr = inputDr;
    document.body.addEventListener("keydown", event => {
        switch (event.key) {
            case "ArrowUp":
            case "w":
                if (lastInputDr.y !== 0) break;
                inputDr = { x: 0, y: -1 };
                break;
            case "ArrowDown":
            case "s" :
                if (lastInputDr.y !== 0) break;
                inputDr = { x: 0, y: 1 };
                break;
            case "ArrowLeft":
            case "a":
                if (lastInputDr.x !== 0) break;
                inputDr = { x: -1, y: 0 };
                break;
            case "ArrowRight":
            case "d":
                if (lastInputDr.x !== 0) break;
                inputDr = { x: 1, y: 0 };
                break;

        }
    });

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
                hideMenu(startUI);
                startGame();
                showMenu(statUI);
                break;
            case "playAgainbtn":
                hideMenu(gameOverUI);
                isGameOver = false;
                clearInterval(gameLoop);
                showMenu(statUI);
                startGame();
                break;
        }
    });
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
        score++;
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
        if (food.x === snake.x && food.y === snake.y || food.x === wall.x && food.y === wall.y){
            food = randomPos();
        }

    }
}
/**
 * Reset Game function to restart game depending on how many lives
 */
function resetGame() {
    clearInterval(gameLoop);
    if (lives <= 0) {
        isGameOver = true;
        showMenu(gameOverUI);
        hideMenu(statUI);
    } else if (lives >= 0) {
        isPaused = true;
        startGame();
    }

}
/**
 * Show Menu function to display menu 
 * @param {getElementById} menu 
 */
function showMenu(menu) {
    menu.style.visibility = "visible";
}
/**
 * Hide Menu function to hide menu 
 * @param {getElementById} menu 
 */
function hideMenu(menu) {
    menu.style.visibility = "hidden";
}
