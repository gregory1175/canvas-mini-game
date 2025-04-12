// Константы игры
export const GAME_CONSTANTS = {
  canvas: document.getElementById("myCanvas"),
  ctx: null,
  ballRadius: 10,
  paddleHeight: 10,
  paddleWidth: 75,
  brickRowCount: 5,
  brickColumnCount: 5,
  brickWidth: 85,
  brickHeight: 20,
  brickPadding: 5,
  brickOffsetTop: 30,
  brickOffsetLeft: 15,
  maxSpeed: 3,
  initialBallSpeedX: 2,
  initialBallSpeedY: -2,
  lives: 3,
};

// Состояние игры
export const GAME_STATE = {
  x: GAME_CONSTANTS.canvas.width / 2,
  y: GAME_CONSTANTS.canvas.height - 30,
  dx: GAME_CONSTANTS.initialBallSpeedX,
  dy: GAME_CONSTANTS.initialBallSpeedY,
  paddleX: (GAME_CONSTANTS.canvas.width - GAME_CONSTANTS.paddleWidth) / 2,
  rightPressed: false,
  leftPressed: false,
  speedMultiplier: 1,
  ballColor: "#0095DD",
  hasCollided: false,
  score: 0,
  bricks: [],
  isMouseMoving: false,
  lastMouseX: 0,
};
