document.addEventListener("DOMContentLoaded", function(event) { 
// varibles to keep of grid/map size
let width = 41;
let height = 41;
let tileSize = 20;

const gameBoard = document.getElementById("gameBoard");

//Snake varibles 
let snake = {x: tileSize * 11, y: tileSize * 11}; // snake start point
let snakeBody = [];

//Food Varibles
let food = {x: tileSize * 16, y: tileSize * 14};;

//walls 
let walls = [
    {direction: "horizontal" , startX:0, endX:width, Y:0, fill:"blue"},
    {direction:'vertical',startY:0,endY:height,X:0,fill:'blue'},
    {direction:'vertical',startY:0,endY:height,X:width -1,fill:'blue'},
    {direction: "horizontal" , startX:0, endX:width, Y:height -1, fill:"blue"}
]

let gameLoop;
let fPS = 10000 / 10

window.onload = function(){
    
    gameLoop = setInterval(Update,fPS)
}

function DrawGame(){
    // Drawing canvas on screen and adjusting size by width * height
    gameBoard.height = height * tileSize;
    gameBoard.width = width * tileSize;
    contx = gameBoard.getContext("2d");
    contx.fillStyle = "white";
    contx.fillRect( 0 , 0 , gameBoard.width, gameBoard.height);
    gameBoard.style.border = "2px solid #000";

    //Drawing Walls on canvas 
    DrawWalls();
    //Drawing Food on Canvas before snake for collision detection
    contx.fillStyle = "brown";
    contx.fillRect(food.x , food.y , tileSize, tileSize);

    //Drawing Snake on Canvas
    contx.fillStyle = "red"
    contx.fillRect(snake.x,snake.y, tileSize, tileSize);


}

function DrawWalls(){
    for(let i = 0 ; i < walls.length ; i++){
        let wall =walls[i];
        contx.fillStyle=wall.fill;
        if(wall.direction == "horizontal"){
            for(let x = wall.startX ; x <= wall.endX ; x++){
                contx.fillRect(x*tileSize, wall.Y * tileSize, tileSize, tileSize)
            }
        }else { 
            for(let y=wall.startY; y <= wall.endY ; y++){
                contx.fillRect(wall.X * tileSize, y * tileSize, tileSize, tileSize)
            }
        
        }
    }
}

function Update(){
    DrawGame();
}



});