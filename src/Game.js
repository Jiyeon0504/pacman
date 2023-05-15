import TileMap from "./TileMap.js";

const tileSize = 32;
const velocity = 2;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileMap = new TileMap(tileSize);
const pacman = tileMap.getPacman(velocity);
const enemies = tileMap.getEnemies(velocity);

let gameOver = false;
let gameWin = false;

const gameOverSound = new Audio("../sounds/gameOver.wav");
const gameWinSound = new Audio("../sounds/gameWin.wav");

function gameLoop() {
  tileMap.draw(ctx);
  drawGameEnd();
  pacman.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
  checkGameOver();
  checkGameWin();
}

function checkGameWin() {
  if (!gameWin) {
    gameWin = tileMap.didWin();
    if (gameWin) {
      gameWinSound.play();
    }
  }
}

function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();
    if (gameOver) {
      gameOverSound.play();
    }
  }
}

function isGameOver() {
  return enemies.some(
    (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
  );
}

// 팩맨이 움직이기 시작할 때 부터 enemy도 움직이게 하기
function pause() {
  return !pacman.madeFirstMove || gameOver || gameWin;
}

function drawGameEnd() {
  if (gameOver || gameWin) {
    let text = "You Win";
    if (gameOver) {
      text = "Game Over";
    }
    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height/3.2 , canvas.width, 80);

    ctx.font='70px comic sans';
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");

    ctx.fillStyle = "white";
    const textWidth = ctx.measureText(text).width;
    const x = (canvas.width - textWidth) / 2; // 캔버스의 중앙에 위치
    const y = canvas.height / 2; // 캔버스의 중앙에 위치
    ctx.fillText(text, x, y);
  }
}

tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 75); //초당 75프레임으로 그려줌
