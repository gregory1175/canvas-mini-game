import { GAME_CONSTANTS, GAME_STATE } from "./constants.js";

// Инициализация игры
function initGame() {
  GAME_CONSTANTS.ctx = GAME_CONSTANTS.canvas.getContext("2d");

  // Инициализация кирпичей
  for (let c = 0; c < GAME_CONSTANTS.brickColumnCount; c++) {
    GAME_STATE.bricks[c] = [];
    for (let r = 0; r < GAME_CONSTANTS.brickRowCount; r++) {
      GAME_STATE.bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
}
// Отрисовка игровых объектов
const Renderer = {
  drawBall() {
    GAME_CONSTANTS.ctx.beginPath();
    GAME_CONSTANTS.ctx.arc(
      GAME_STATE.x,
      GAME_STATE.y,
      GAME_CONSTANTS.ballRadius,
      0,
      Math.PI * 2
    );
    GAME_CONSTANTS.ctx.fillStyle = GAME_STATE.ballColor;
    GAME_CONSTANTS.ctx.fill();
    GAME_CONSTANTS.ctx.closePath();
  },

  drawPaddle() {
    GAME_CONSTANTS.ctx.beginPath();
    GAME_CONSTANTS.ctx.rect(
      GAME_STATE.paddleX,
      GAME_CONSTANTS.canvas.height - GAME_CONSTANTS.paddleHeight,
      GAME_CONSTANTS.paddleWidth,
      GAME_CONSTANTS.paddleHeight
    );
    GAME_CONSTANTS.ctx.fillStyle = "#0095DD";
    GAME_CONSTANTS.ctx.fill();
    GAME_CONSTANTS.ctx.closePath();
  },

  drawBricks() {
    for (let c = 0; c < GAME_CONSTANTS.brickColumnCount; c++) {
      for (let r = 0; r < GAME_CONSTANTS.brickRowCount; r++) {
        if (GAME_STATE.bricks[c][r].status == 1) {
          const brickX =
            c * (GAME_CONSTANTS.brickWidth + GAME_CONSTANTS.brickPadding) +
            GAME_CONSTANTS.brickOffsetLeft;
          const brickY =
            r * (GAME_CONSTANTS.brickHeight + GAME_CONSTANTS.brickPadding) +
            GAME_CONSTANTS.brickOffsetTop;

          GAME_STATE.bricks[c][r].x = brickX;
          GAME_STATE.bricks[c][r].y = brickY;

          GAME_CONSTANTS.ctx.beginPath();
          GAME_CONSTANTS.ctx.rect(
            brickX,
            brickY,
            GAME_CONSTANTS.brickWidth,
            GAME_CONSTANTS.brickHeight
          );
          GAME_CONSTANTS.ctx.fillStyle = "#0095DD";
          GAME_CONSTANTS.ctx.fill();
          GAME_CONSTANTS.ctx.closePath();
        }
      }
    }
  },

  drawScore() {
    GAME_CONSTANTS.ctx.font = "16px Arial";
    GAME_CONSTANTS.ctx.fillStyle = "#0095DD";
    GAME_CONSTANTS.ctx.fillText("Score: " + GAME_STATE.score, 8, 20);
  },

  drawLives() {
    GAME_CONSTANTS.ctx.font = "16px Arial";
    GAME_CONSTANTS.ctx.fillStyle = "#0095DD";
    GAME_CONSTANTS.ctx.fillText(
      "Lives: " + GAME_CONSTANTS.lives,
      GAME_CONSTANTS.canvas.width - 65,
      20
    );
  },

  clearCanvas() {
    GAME_CONSTANTS.ctx.clearRect(
      0,
      0,
      GAME_CONSTANTS.canvas.width,
      GAME_CONSTANTS.canvas.height
    );
  },
};

// Обработка коллизий
const Collision = {
  detectBrickCollision() {
    for (let c = 0; c < GAME_CONSTANTS.brickColumnCount; c++) {
      for (let r = 0; r < GAME_CONSTANTS.brickRowCount; r++) {
        const brick = GAME_STATE.bricks[c][r];
        if (brick.status == 1) {
          if (
            GAME_STATE.x > brick.x &&
            GAME_STATE.x < brick.x + GAME_CONSTANTS.brickWidth &&
            GAME_STATE.y > brick.y &&
            GAME_STATE.y < brick.y + GAME_CONSTANTS.brickHeight
          ) {
            GAME_STATE.dy = -GAME_STATE.dy;
            brick.status = 0;
            GAME_STATE.hasCollided = true;
            GAME_STATE.score++;
            GameMechanics.increaseSpeed();
            if (
              GAME_STATE.score ==
              GAME_CONSTANTS.brickRowCount * GAME_CONSTANTS.brickColumnCount
            ) {
              GAME_STATE.score += 10;
              alert("YOU WIN, CONGRATULATIONS!");
              document.location.reload();
            }
            return true;
          }
        }
      }
    }
    GAME_STATE.hasCollided = false;
    return false;
  },

  detectWallCollision() {
    if (
      GAME_STATE.x + GAME_STATE.dx >
        GAME_CONSTANTS.canvas.width - GAME_CONSTANTS.ballRadius ||
      GAME_STATE.x + GAME_STATE.dx < GAME_CONSTANTS.ballRadius
    ) {
      GAME_STATE.dx = -GAME_STATE.dx;
    }

    if (GAME_STATE.y + GAME_STATE.dy < GAME_CONSTANTS.ballRadius) {
      GAME_STATE.dy = -GAME_STATE.dy;
    } else if (
      GAME_STATE.y + GAME_STATE.dy >
      GAME_CONSTANTS.canvas.height - GAME_CONSTANTS.ballRadius
    ) {
      if (
        GAME_STATE.x > GAME_STATE.paddleX - 5 &&
        GAME_STATE.x < GAME_STATE.paddleX + GAME_CONSTANTS.paddleWidth + 5
      ) {
        GAME_STATE.dy = -GAME_STATE.dy;
        GAME_STATE.ballColor = "#0095DD";
      } else {
        GAME_CONSTANTS.lives--;
        if (GAME_CONSTANTS.lives <= 0) {
          document.location.reload();
        } else {
          GAME_STATE.x = GAME_CONSTANTS.canvas.width / 2;
          GAME_STATE.y = GAME_CONSTANTS.canvas.height - 30;
          GAME_STATE.dx = 2;
          GAME_STATE.dy = -2;
          GAME_STATE.paddleX =
            (GAME_CONSTANTS.canvas.width - GAME_CONSTANTS.paddleWidth) / 2;
        }
      }
    }
  },
};

// Игровые механики
const GameMechanics = {
  increaseSpeed() {
    if (
      Math.abs(GAME_STATE.dx) >= GAME_CONSTANTS.maxSpeed ||
      Math.abs(GAME_STATE.dy) >= GAME_CONSTANTS.maxSpeed
    ) {
      GAME_STATE.dx = Math.sign(GAME_STATE.dx) * GAME_CONSTANTS.maxSpeed;
      GAME_STATE.dy = Math.sign(GAME_STATE.dy) * GAME_CONSTANTS.maxSpeed;
      return;
    }
    GAME_STATE.dx *= 1.2;
    GAME_STATE.dy *= 1.2;
  },

  updatePaddlePosition() {
    if (!GAME_STATE.useKeyboard) return;

    if (
      GAME_STATE.rightPressed &&
      GAME_STATE.paddleX <
        GAME_CONSTANTS.canvas.width - GAME_CONSTANTS.paddleWidth
    ) {
      GAME_STATE.paddleX += 7;
    } else if (GAME_STATE.leftPressed && GAME_STATE.paddleX > 0) {
      GAME_STATE.paddleX -= 7;
    }
  },

  updateBallPosition() {
    GAME_STATE.x += GAME_STATE.dx;
    GAME_STATE.y += GAME_STATE.dy;
  },
};

function mouseMoveHandler(e) {
  if (GAME_STATE.useKeyboard) return;

  const relativeX = e.clientX - GAME_CONSTANTS.canvas.offsetLeft;
  const halfPaddle = GAME_CONSTANTS.paddleWidth / 2;

  if (
    relativeX > halfPaddle &&
    relativeX < GAME_CONSTANTS.canvas.width - halfPaddle
  ) {
    GAME_STATE.paddleX = relativeX - halfPaddle;
  } else if (relativeX <= halfPaddle) {
    GAME_STATE.paddleX = 0;
  } else {
    GAME_STATE.paddleX =
      GAME_CONSTANTS.canvas.width - GAME_CONSTANTS.paddleWidth;
  }

  GAME_STATE.lastMouseX = e.clientX;
}

// Обработчики ввода
function keyDownHandler(e) {
  GAME_STATE.useKeyboard = true;

  if (e.keyCode == 39) {
    GAME_STATE.rightPressed = true;
  } else if (e.keyCode == 37) {
    GAME_STATE.leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    GAME_STATE.rightPressed = false;
  } else if (e.keyCode == 37) {
    GAME_STATE.leftPressed = false;
  }

  if (!GAME_STATE.rightPressed && !GAME_STATE.leftPressed) {
    GAME_STATE.useKeyboard = false;
  }
}
// Главный игровой цикл
function gameLoop() {
  Renderer.clearCanvas();
  Renderer.drawBricks();
  Renderer.drawBall();
  Renderer.drawPaddle();
  Renderer.drawLives();
  Renderer.drawScore();

  Collision.detectBrickCollision();
  Collision.detectWallCollision();

  if (GAME_STATE.hasCollided === true) {
    GAME_STATE.ballColor = "red";
  }

  if (GAME_STATE.isMouseMoving) {
    setTimeout(() => {
      GAME_STATE.isMouseMoving = false;
    }, 100);
  }

  GameMechanics.updatePaddlePosition();
  GameMechanics.updateBallPosition();
}

// Запуск игры
function startGame() {
  initGame();

  function loop() {
    gameLoop();
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

startGame();
