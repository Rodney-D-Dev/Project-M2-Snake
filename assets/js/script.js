document.addEventListener("DOMContentLoaded", function (event) {
    // varibles to keep of grid/map size
    let width = 30;
    let height = 30;
    let tileSize = 20;
    // Drawing canvas on screen and adjusting size by width * height
    const gameBoard = document.getElementById("gameBoard");
    const contx = gameBoard.getContext("2d");
    gameBoard.height = height * tileSize;
    gameBoard.width = width * tileSize;
    gameBoard.style.border = "1px solid #000";

    let scoreDis = document.getElementById("score");
    let levelDis = document.getElementById("level");
    let livesDis = document.getElementById("lives");

    // Stats
    let score = 0;
    let level = 1;
    let lives = 3;

    let currentlives;

    //Snake varibles 
    let snake = randomPos(); // snake start point
    let snakeBody = [];
    let snakeSpeed = 5;
    //Food Varibles
    let food = randomPos();;

    //walls 
    let walls = [];
    let wall = {
        x: tileSize,
        y: tileSize
    };

    let door = {
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


    window.onload = function () {
        
        gameStart();
    }
    function gameStart(){
        currentlives = lives;
        snakeBody.length = 1;
        //genFood();
        gameLoop = setInterval(update, fPS);

    }
    function update() {
        drawGame();
        input();
        moveSnake();
        collision();
    }

    function drawGame() {
        contx.fillStyle = "white";
        contx.fillRect(0, 0, gameBoard.width, gameBoard.height);
        //Drawing Walls on canvas 
        createMap(levelOne);
        drawStats();
        drawMap();
        drawFood();
        drawSnake();
    }
    function drawStats(){
        scoreDis.innerHTML = `score:${score}`;
        levelDis.innerHTML = `Level:${level}`;
        livesDis.innerHTML = `Lives:${lives}`;
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
                if (char === '#') walls.push({ x: x * wall.x, y: y * wall.y });
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
    function randomPos(){
        return {
            x: Math.floor(Math.random() * height) * tileSize,
            y: Math.floor(Math.random() * width) * tileSize
        }
    }
    // user input for game controll
    function input() {
        lastInputDr = inputDr;
        window.addEventListener("keydown", event => {
            switch (event.key) {
                case "ArrowUp":
                    if(lastInputDr.y !== 0) break;
                    inputDr = { x: 0, y: -1 };
                    break;
                case "ArrowDown":
                    if(lastInputDr.y !== 0) break;
                    inputDr = { x: 0, y: 1 };
                    break;
                case "ArrowLeft":
                    if(lastInputDr.x !== 0) break;
                    inputDr = { x: -1, y: 0 };
                    break;
                case "ArrowRight":
                    if(lastInputDr.x !== 0) break;
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


    }

    function collision() {
        //colision if snake hits its self
        for(let i = 0; i < snakeBody.length - 1; i++){
            if(snake.x === snakeBody[i][0] && snake.y === snakeBody[i][1]){
                lives--;
                currentlives = lives;
                resetGame();
            }
        }

        //if snake colides with food grow
        if (snake.x === food.x && snake.y === food.y) {
            snakeBody.unshift({ ...snakeBody });
            food = randomPos();
            score++
        }
        //grab all the walls for wall collisions
        for (let i = 0; i < walls.length; i++) {
            const wall = walls[i];
            // if snake hits wall
            if (snake.x === wall.x && snake.y === wall.y) {
                // loose live and reset level.
                lives--;
                currentlives = lives;
                resetGame();
            }
            //detect if food is generated on snake or wall
            if (food.x === snake.x && food.y === snake.y || food.x === wall.x && food.y === wall.y) {
                food = randomPos();
            }
        }
    }
    function pauseGame() {
        isPaused = true;
        clearInterval(gameLoop);
        console.log("game paused!!");
    }
    function resumeGame() {
        isPaused = false;
        gameLoop = setInterval(update, fPS);
        console.log("game Resummed");
    }
    function resetGame() {
        //pause game to show what happened
        pauseGame();
        if (currentlives <= 0) {
            isGameOver = true;
            gameOver();
        } else {
            //set score back to 0
            score = 0;
            //reset snake 
            snakeBody.length = 1;
            snake = randomPos();
            inputDr.x = 0;
            inputDr.y = 0;
            resumeGame();
        }

    }
    function gameOver(){
        contx.font = "50px MV Boli"
        contx.fillStyle = "black";
        contx.textAlign = "center";
        contx.fillText(" GAME OVER! ",width * tileSize / 2,height * tileSize /2);
    }
});

//levels for generating map walls 

let levelOne = [
    '###############          #####',
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
    '###############          #####',
]

let levelTwo = [
    '####################',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#        ###       #',
    '#                  #',
    '#        ###       #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '####################',
]

let levelThree = [
    '####################',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '###   ######       #',
    '#                  #',
    '#     ###### #######',
    '#     #            #',
    '#     #            #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '#                  #',
    '####################',
]