document.addEventListener("DOMContentLoaded", function (event) {
    // varibles to keep of grid/map size
    let width = 20;
    let height = 20;
    let tileSize = 20;

    const gameBoard = document.getElementById("gameBoard");
    const contx = gameBoard.getContext("2d");
    //Snake varibles 
    let snake = {
        x: tileSize * 11, y: tileSize * 11
    }; // snake start point
    let snakeBody = [];
    let snakeSpeed = 5;
    //Food Varibles
    let food = { x: tileSize * 16, y: tileSize * 14 };

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


    let fPS = 1000 / snakeSpeed;
    let gameLoop = 0;

    let isPaused = false;
    let isGameOver = false;


    window.onload = function () {
        genFood();
        gameLoop = setInterval(update, fPS);
    }

    function update() {
        drawGame();
        input();
        moveSnake();
        collision();
    }

    function drawGame() {
        // Drawing canvas on screen and adjusting size by width * height
        gameBoard.height = height * tileSize;
        gameBoard.width = width * tileSize;
        contx.fillStyle = "white";
        contx.fillRect(0, 0, gameBoard.width, gameBoard.height);
        gameBoard.style.border = "2px solid #000";

        //Drawing Walls on canvas 
        createMap(levelOne);
        drawMap();
        drawFood();
        drawSnake();
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
            contx.fillStyle = (i <= 0) ? "yellow" : "red";
            contx.fillRect(snakeBody[i][0], snakeBody[i][1], tileSize, tileSize);
        }

    }
    // snake movement
    function moveSnake() {

        snake.x += inputDr.x * tileSize;
        snake.y += inputDr.y * tileSize;
        //console.log(inputDr.x);
    }

    // helper fuction for generating food at random location on grid/map 
    function genFood() {
        food = {
            x: Math.floor(Math.random() * height) * tileSize,
            y: Math.floor(Math.random() * width) * tileSize
        }
    }
    // user input for game controll
    function input() {
        window.addEventListener("keydown", event => {
            switch (event.key) {
                case "ArrowUp":
                    inputDr = { x: 0, y: -1 };
                    break;
                case "ArrowDown":
                    inputDr = { x: 0, y: 1 };
                    break;
                case "ArrowLeft":
                    inputDr = { x: -1, y: 0 };
                    break;
                case "ArrowRight":
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
        //if snake colides with food grow
        if (snake.x === food.x && snake.y === food.y) {
            snakeBody.unshift({ ...snakeBody });
            genFood();
        }
        //grab all the walls for wall collisions
        for (let i = 0; i < walls.length; i++) {
            const wall = walls[i];
            // if snake hits wall
            if (snake.x === wall.x && snake.y === wall.y) {
                // loose live and restart level.
                console.log("snake hit wall");
            }
            //detect if food is generated on snake or wall
            if (food.x === snake.x && food.y === snake.y || food.x === wall.x && food.y === wall.y) {
                genFood();
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
    function restartGame(){
        //set score back to 0
        score = 0;
        //reset snake position
        snake = {x: tileSize * 11, y: tileSize * 11};

    }

});

//levels for generating map walls 

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