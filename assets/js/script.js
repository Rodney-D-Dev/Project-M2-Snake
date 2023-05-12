
// varibles to keep of grid/map size
let width = 20;
let height = 20;
let tileSize = 20;

const gameBoard = document.getElementById("gameBoard");

window.onload = function(){
    DrawGame();
}

function DrawGame(){
    gameBoard.height = height * tileSize;
    gameBoard.height = width * tileSize;
    contx = gameBoard.getContext("2d");
    contx.fillStyle = "#E0D9F6";
    contx.fillRect( 0 , 0 , gameBoard.width, gameBoard.height);
    gameBoard.style.border = "2px solid #000";
}