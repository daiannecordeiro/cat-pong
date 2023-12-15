const canvasElement = document.querySelector("canvas");
const canvasCtx = canvasElement.getContext("2d");

function setup() {
  canvasElement.width = canvasCtx.width = window.innerWidth;
  canvasElement.height = canvasCtx.height = window.innerHeight;
}

const background = {
  w: window.innerWidth,
  h: window.innerHeight,
  lineWidth: 15,

  draw: function () {
    canvasCtx.fillStyle = "lightpink";
    canvasCtx.fillRect(0, 0, this.w, this.h);
    canvasCtx.fillStyle = "bisque";
    canvasCtx.fillRect(
      this.w / 2 - this.lineWidth / 2,
      0,
      this.lineWidth,
      this.h
    );
  },
};

function loadImages() {
  catLeftPalm.image.src = "./assets/cat-palm-left.png";
  catRightPalm.image.src = "./assets/cat-palm-right.png";
  yarnBall.image.src = "./assets/yarn-ball.png";
}

const score = {
  p1: 0,
  p2: 0,
  increaseP1: function () {
    this.p1++;
  },
  increaseP2: function () {
    this.p2++;
  },
  draw: function () {
    canvasCtx.font = "bold 48px Arial";
    canvasCtx.textAlign = "center";
    canvasCtx.textBaseline = "top";
    canvasCtx.fillStyle = "#2F0134";
    canvasCtx.fillText(this.p1, background.w / 4, 50);
    canvasCtx.fillText(this.p2, background.w / 2 + background.w / 4, 50);
  },
};

const catPalms = {
  w: 128,
  h: 128,
};

const catLeftPalm = {
  x: 0,
  y: 250,
  image: new Image(),
  controlLeft: { x: 0, y: 0 },

  draw: function () {
    canvasCtx.drawImage(this.image, this.x, this.y, catPalms.w, catPalms.h);
  },
};

const catRightPalm = {
  x: window.innerWidth - catPalms.w,
  y: 250,
  image: new Image(),

  draw: function () {
    canvasCtx.drawImage(this.image, this.x, this.y, catPalms.w, catPalms.h);
  },
};

const yarnBall = {
  w: 48,
  h: 48,
  x: (window.innerWidth - 48) / 2,
  y: (window.innerHeight - 48) / 2,
  speed: 10,
  directionX: 1,
  directionY: 1,
  image: new Image(),

  _calcPosition: function () {
    if (
      this.x < catLeftPalm.x + catPalms.w &&
      this.x + this.w > catLeftPalm.x &&
      this.y < catLeftPalm.y + catPalms.h &&
      this.y + this.h > catLeftPalm.y
    ) {
      this._reverseX();
    } else if (this.x > background.w) {
      score.increaseP1();
      this.x = (window.innerWidth - 48) / 2;
      this.y = (window.innerHeight - 48) / 2;
      this.increaseSpeed();
    }

    if (
      this.x < catRightPalm.x + catPalms.w &&
      this.x + this.w > catRightPalm.x &&
      this.y < catRightPalm.y + catPalms.h &&
      this.y + this.h > catRightPalm.y
    ) {
      this._reverseX();
    } else if (this.x < 0) {
      score.increaseP2();
      this.x = (window.innerWidth - 48) / 2;
      this.y = (window.innerHeight - 48) / 2;
      this.increaseSpeed();
    }

    if (
      (this.y < 0 && this.directionY < 0) ||
      (this.y > window.innerHeight - this.h && this.directionY > 0)
    ) {
      this._reverseY();
    }
  },

  _reverseY: function () {
    this.directionY *= -1;
  },

  _reverseX: function () {
    this.directionX *= -1;
  },

  increaseSpeed: function () {
    this.speed += 5;
  },

  _move: function () {
   this.x += this.directionX * this.speed;
    this.y += this.directionY * this.speed;
  },

  draw: function () {
    canvasCtx.drawImage(this.image, this.x, this.y, this.w, this.h);

    yarnBall._calcPosition();
    yarnBall._move();
  },
};

function draw() {
  background.draw();
  catLeftPalm.draw();
  catRightPalm.draw();
  yarnBall.draw();
  score.draw();
}

const keysPressed = {};

function handleKeys() {
  let moveDistance = 10;

  if (keysPressed["ArrowUp"] && catRightPalm.y - moveDistance >= 0) {
    catRightPalm.y -= moveDistance;
  }
  if (
    keysPressed["ArrowDown"] &&
    catRightPalm.y + moveDistance <= canvasElement.height - catPalms.h
  ) {
    catRightPalm.y += moveDistance;
  }
  if (keysPressed["w"] && catLeftPalm.y - moveDistance >= 0) {
    catLeftPalm.y -= moveDistance;
  }
  if (
    keysPressed["s"] &&
    catLeftPalm.y + moveDistance <= canvasElement.height - catPalms.h
  ) {
    catLeftPalm.y += moveDistance;
  }
}

canvasElement.addEventListener("keydown", (e) => {
  keysPressed[e.key] = true;
});

canvasElement.addEventListener("keyup", (e) => {
  keysPressed[e.key] = false;
});

function animate() {
  requestAnimationFrame(animate);
  draw();
  handleKeys();
}

function main() {
  setup();
  loadImages();
  animate();
}

canvasElement.setAttribute("tabindex", 0);
canvasElement.focus();

const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
startButton.addEventListener("click", startGame);

function startGame() {
  main();
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  gameScreen.focus();
}
