document.addEventListener("DOMContentLoaded", function (event) {
    // varibles to keep of grid/map size
    let width = 41;
    let height = 41;
    let tileSize = 20;

    const gameBoard = document.getElementById("gameBoard");

    //Snake varibles 
    let snake = { x: tileSize * 11, y: tileSize * 11 }; // snake start point
    let snakeBody = [];

    //Food Varibles
    let food = { x: tileSize * 16, y: tileSize * 14 };;

    //walls 
    let walls = [
        { direction: "horizontal", startX: 0, endX: width, Y: 0, fill: "blue" },
        { direction: 'vertical', startY: 0, endY: height, X: 0, fill: 'blue' },
        { direction: 'vertical', startY: 0, endY: height, X: width - 1, fill: 'blue' },
        { direction: "horizontal", startX: 0, endX: width, Y: height - 1, fill: "blue" }
    ]

    //directinal control
    let inputDr = {x: 0, y: 0};

    let gameLoop;
    let fPS = 1000 / 10

    window.onload = function () {

        gameLoop = setInterval(Update, fPS)
    }

    function DrawGame() {
        // Drawing canvas on screen and adjusting size by width * height
        gameBoard.height = height * tileSize;
        gameBoard.width = width * tileSize;
        contx = gameBoard.getContext("2d");
        contx.fillStyle = "white";
        contx.fillRect(0, 0, gameBoard.width, gameBoard.height);
        gameBoard.style.border = "2px solid #000";

        //Drawing Walls on canvas 
        DrawWalls();
        //Drawing Food on Canvas before snake for collision detection
        contx.fillStyle = "brown";
        contx.fillRect(food.x, food.y, tileSize, tileSize);

        //Drawing Snake on Canvas
        contx.fillStyle = "red"
        contx.fillRect(snake.x, snake.y, tileSize, tileSize);


    }

    function DrawWalls() {
        for (let i = 0; i < walls.length; i++) {
            let wall = walls[i];
            contx.fillStyle = wall.fill;
            if (wall.direction == "horizontal") {
                for (let x = wall.startX; x <= wall.endX; x++) {
                    contx.fillRect(x * tileSize, wall.Y * tileSize, tileSize, tileSize)
                }
            } else {
                for (let y = wall.startY; y <= wall.endY; y++) {
                    contx.fillRect(wall.X * tileSize, y * tileSize, tileSize, tileSize)
                }

            }
        }
    }

    function Update() {
        DrawGame();
        Input();
        MoveSnake();
    }

    function MoveSnake () {
        
        snake.x += inputDr.x * tileSize;
        snake.y += inputDr.y * tileSize;
        //console.log(inputDr.x);
    }
    // user input for game controll
    function Input() {
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
            }
        })
    }

});