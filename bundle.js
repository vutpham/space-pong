/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {


INITIAL_RADIUS = 35;

class Ball {

  constructor(stage, maxDistance) {
    this.stage = stage;
    this.maxDistance = maxDistance;

    this.shape = new createjs.Shape();

    this.reset();
  }

  adjustForRadius() {
    if (this.rawX > 400) {
      this.shape.x -= this.radius * (this.rawX - 400)/312;
    } else if (this.rawX < 400) {
      this.shape.x += this.radius * (400 - this.rawX)/312;
    }

    if (this.rawY > 300) {
      this.shape.y -= this.radius * (this.rawY - 300)/209;
    } else if (this.rawY < 300) {
      this.shape.y += this.radius * (300 - this.rawY)/209;
    }
  }

  applyPerspective() {
    const distanceFactor = this.distance / this.maxDistance;

    this.shape.x = this.rawX - (this.rawX - this.farX) * distanceFactor;
    this.shape.y = this.rawY - (this.rawY - this.farY) * distanceFactor;
  }

  applySpin() {
    if (this.direction === "out"){
      this.xVelocity -= this.xSpin / this.maxDistance;
      this.yVelocity -= this.ySpin / this.maxDistance;
    } else {
      this.xVelocity += this.xSpin / this.maxDistance;
      this.yVelocity += this.ySpin / this.maxDistance;
    }
  }

  applyVelocity() {
    this.rawX += this.xVelocity;
    this.farX = (this.rawX - 400) * 79/312 + 400;

    this.rawY += this.yVelocity;
    this.farY = (this.rawY - 300) * 53/209 + 300;
  }

  draw() {
    this.fillCommand = this.shape
      .graphics
      .beginRadialGradientFill(["#EEE","#444"], [0, 1], 15, -15, 0, 0, 0, 35).command;
    this.silverGradient = this.fillCommand.style;
    this.shape.graphics.drawCircle(0, 0, INITIAL_RADIUS);

    this.stage.addChild(this.shape);
  }

  move() {
    this.updateDistance();
    this.scaleBall();
    this.applySpin();
    this.applyVelocity();
    this.applyPerspective();
    this.adjustForRadius();

    this.stage.update();
  }

  reset() {
    this.shape.x = 400;
    this.shape.y = 300;

    this.distance = 0;
    this.direction = "out";
    this.radius = INITIAL_RADIUS;

    this.xVelocity = 0;
    this.yVelocity = 0;

    this.xSpin = 5 * (Math.random() - 0.5);
    this.ySpin = 5 * (Math.random() - 0.5);

    this.rawX = 400;
    this.rawY = 300;

    this.farX = 400;
    this.farY = 300;

    this.shape.scaleX = 1;
    this.shape.scaleY = 1;

    if (this.fillCommand) {
      this.fillCommand.style = this.silverGradient;
    }
  }

  scaleBall() {
    this.shape.scaleX = 1 - this.distance * 3 / (4 * this.maxDistance);
    this.shape.scaleY = 1 - this.distance * 3 / (4 * this.maxDistance);

    this.radius = 35 * this.shape.scaleX;
  }

  updateDistance() {
    if (this.direction === "out"){
      this.distance += 1;
    } else {
      this.distance -= 1;
    }
  }
}

module.exports = Ball;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

let CENTER_X = 400;
let CENTER_Y = 300;
let MAX_DISTANCE = 100;

class Field {
  constructor(stage, game) {
    this.stage = stage;
    this.game = game;
    this.createField();
    this.gamePieces();

    this.ticker = createjs.Ticker;
    this.ticker.setFPS(60);
  }

  createPlayerPaddle() {
    const playerPaddle = new createjs.Shape();
    playerPaddle.graphics
      .beginStroke("DarkBlue")
      .setStrokeStyle(4)
      .beginFill("LightBlue")
      .drawRoundRect(0, 0, 120, 80, 10);
    playerPaddle.name = 'playerPaddle';
    playerPaddle.alpha= 0.5;
    playerPaddle.prevX = 0;
    playerPaddle.prevY = 0;

    this.stage.addChild(playerPaddle);
  }

  createCpuPaddle() {
    const cpuPaddle = new createjs.Shape();
    cpuPaddle.graphics
      .beginStroke("Red")
      .setStrokeStyle(2)
      .beginFill("Pink")
      .drawRoundRect(385, 290, 30, 20, 3);
    cpuPaddle.name = 'cpuPaddle';
    cpuPaddle.alpha = 0.5;
    cpuPaddle.rawX = 0;
    cpuPaddle.rawY = 0;
    cpuPaddle.prevRawX = 0;
    cpuPaddle.prevRawY = 0;

    this.stage.addChild(cpuPaddle);
  }

  createBall() {
    const ball = new createjs.Shape();
    ball.graphics
      .beginFill("ghostwhite")
      .drawPolyStar(0, 0, 35, 10, 0.1);
    ball.name = 'ball';

    this.createTracker();
    this.stage.addChild(ball);
  }

  scaleBall() {
    const ball = this.stage.getChildByName('ball');
    ball.scaleX = 1 - ball.distance * 2 / (3 * MAX_DISTANCE);
    ball.scaleY = 1 - ball.distance * 2 / (3 * MAX_DISTANCE);

    ball.radius = 35 * ball.scaleX;
  }

  gamePieces() {
    this.createPlayerPaddle();
    this.createBall();
    this.createCpuPaddle();

    createjs.Ticker.addEventListener('tick', this.movePaddles.bind(this));
  }

  movePlayerPaddle() {
    const playerPaddle = this.stage.getChildByName('playerPaddle');

    let difX;
    let difY;

    // console.log(this.stage.mouseX);
    // console.log(this.stage.mouseY);

    if (this.stage.mouseX < 652 && this.stage.mouseX > 148){
      difX = this.stage.mouseX - playerPaddle.x - 60;
    } else if (this.stage.mouseX <= 148){
      difX = 148 - playerPaddle.x - 60;
    } else {
      difX = 652 - playerPaddle.x - 60;
    }

    if (this.stage.mouseY < 432 && this.stage.mouseY > 131){
      difY = this.stage.mouseY - playerPaddle.y - 40;
    } else if (this.stage.mouseY <= 131){
      difY = 131 - playerPaddle.y - 40;
    } else {
      difY = 469 - playerPaddle.y - 40;
    }

    playerPaddle.prevX = playerPaddle.x;
    playerPaddle.prevY = playerPaddle.y;
    playerPaddle.x += difX/1.2;
    playerPaddle.y += difY/1.2;
  }

  moveCpuPaddle() {
    const ball = this.stage.getChildByName('ball');
    const cpuPaddle = this.stage.getChildByName('cpuPaddle');
    const cpuDifX = ball.rawX - 400 - cpuPaddle.rawX;
    const cpuDifY = ball.rawY - 300 - cpuPaddle.rawY;

    cpuPaddle.x = cpuPaddle.rawX * 79/312;
    cpuPaddle.y = cpuPaddle.rawY * 53/209;

    cpuPaddle.prevX = cpuPaddle.rawX;
    cpuPaddle.prevY = cpuPaddle.rawY;
    cpuPaddle.rawX += cpuDifX/24;
    if (cpuPaddle.rawX > 249){
      cpuPaddle.rawX = 249;
    } else if (cpuPaddle.rawX < -241) {
      cpuPaddle.rawX = -241;
    }

    cpuPaddle.rawY += cpuDifY/25;
    if (cpuPaddle.rawY > 161){
      cpuPaddle.rawY = 161;
    } else if (cpuPaddle.rawY < -161) {
      cpuPaddle.rawY = -161;
    }
  }

  movePaddles() {
    this.movePlayerPaddle();
    this.moveCpuPaddle();
    this.stage.update();
  }

  drawRectangle(shape, { x, y, w, h }) {
    shape.graphics.beginStroke("Yellow");
    shape.graphics.setStrokeStyle(1);
    shape.snapToPixel = true;
    shape.graphics.drawRect(x, y, w, h);

    this.stage.addChild(shape);
  }

  drawCorner(shape, { mtx, mty, ltx, lty }) {
    shape.graphics.beginStroke("Yellow");
    shape.graphics.setStrokeStyle(1);
    shape.snapToPixel = true;
    shape.graphics.moveTo(mtx, mty);
    shape.graphics.lineTo(ltx, lty);

    this.stage.addChild(shape);
  }

  createField() {
    const borderFront = new createjs.Shape();
    const borderEnd = new createjs.Shape();

    this.drawRectangle(borderFront, { x: 88, y: 91, w: 624, h: 418 });
    this.drawRectangle(borderEnd, { x: 322, y: 247, w: 158, h: 106 });

    let cornerNW = new createjs.Shape();
    let cornerNE = new createjs.Shape();
    let cornerSE = new createjs.Shape();
    let cornerSW = new createjs.Shape();

    this.drawCorner(cornerNW, { mtx: 88, mty: 91, ltx: 322, lty: 247 });
    this.drawCorner(cornerNW, { mtx: 712, mty: 91, ltx: 479, lty: 247 });
    this.drawCorner(cornerNW, { mtx: 712, mty: 509, ltx: 479, lty: 353 });
    this.drawCorner(cornerNW, { mtx: 88, mty: 509, ltx: 322, lty: 353 });
  }

  createTracker() {
    const tracker = new createjs.Shape();

    tracker.graphics.beginStroke("White");
    tracker.graphics.setStrokeStyle(2);
    tracker.graphics.snapToPixel = true;
    tracker.graphics.drawRect(88, 91, 624, 418);
    tracker.name = 'tracker';

    this.stage.addChild(tracker);
  }

  scaleTracker() {
    const tracker = this.stage.getChildByName('tracker');
    const ball = this.stage.getChildByName('ball');

    const trackerX = 88 + ball.distance * (322 - 88) / MAX_DISTANCE;
    const trackerY = 91 + ball.distance * (247 - 91) / MAX_DISTANCE;
    const trackerW = 624 - ball.distance * (624 - 158) / MAX_DISTANCE;
    const trackerH = 418 - ball.distance * (418 - 106) / MAX_DISTANCE;

    tracker.graphics.clear().beginStroke("White").drawRect(trackerX, trackerY, trackerW, trackerH);
  }

  detectPlayerPaddle() {
    const ball = this.stage.getChildByName('ball');
    const playerPaddle = this.stage.getChildByName('playerPaddle');

    if (ball.x - (ball.radius) <= playerPaddle.x + 120
        && ball.x + (ball.radius) >= playerPaddle.x
        && ball.y - (ball.radius) <= playerPaddle.y + 60
        && ball.y + (ball.radius) >= playerPaddle.y) {
      console.log(`${playerPaddle.x}, ${playerPaddle.prevX}`);
      this.getSpin();
    } else {
      console.log('else --- player hit');
      this.ticker.removeAllEventListeners('tick');
      this.ticker.addEventListener('tick', this.movePaddles.bind(this));
      // setTimeout(this.setStage.bind(this), 1000);
      this.game.resetPieces('player');
    }
  }

  detectCpuPaddle() {
    const ball = this.stage.getChildByName('ball');
    const cpuPaddle = this.stage.getChildByName('cpuPaddle');

    if (ball.x - 400 - (ball.radius - 2) <= cpuPaddle.x + 15
        && ball.x - 400 + (ball.radius - 2) >= cpuPaddle.x - 15
        && ball.y - 300 - (ball.radius - 2) <= cpuPaddle.y + 10
        && ball.y - 300 + (ball.radius - 2) >= cpuPaddle.y - 10) {
      console.log(`cpu hit!`);
    } else {
      console.log('no hit');
      this.ticker.removeEventListener('tick', this.movePaddles.bind(this));
      // setTimeout(setStage(ball, stage, tracker), 1000);
      this.game.resetPieces('cpu');
    }
  }

  getSpin() {
    const ball = this.stage.getChildByName('ball');
    const playerPaddle = this.stage.getChildByName('playerPaddle');

    ball.xSpin += playerPaddle.x - playerPaddle.prevX;
    ball.ySpin += playerPaddle.y - playerPaddle.prevY;
  }

  addSpin() {
    const ball = this.stage.getChildByName('ball');
    ball.rotation += 8;
    ball.xVelocity -= ball.xSpin / MAX_DISTANCE;
    ball.yVelocity -= ball.ySpin / MAX_DISTANCE;
  }

  addVelocity() {
    const ball = this.stage.getChildByName('ball');

    ball.rawX += ball.xVelocity;
    ball.farX = (ball.rawX - 400) * 79/312 + 400;

    ball.rawY += ball.yVelocity;
    ball.farY = (ball.rawY - 300) * 53/209 + 300;
  }

  detectWalls() {
    const ball = this.stage.getChildByName('ball');

    if (ball.rawX >= 677 || ball.rawX <= 122) {
      ball.xVelocity = ball.xVelocity * -1;
      ball.xSpin = 0;
    }

    if (ball.rawY >= (512 - 35) || ball.rawY <= (92 + 35)) {
      ball.yVelocity = ball.yVelocity * -1;
      ball.ySpin = 0;
    }

  }

  applyScaling() {
    const ball = this.stage.getChildByName('ball');

    ball.x = ball.rawX - (ball.rawX - ball.endX) * ball.distance / MAX_DISTANCE;
    ball.y = ball.rawY - (ball.rawY - ball.endY) * ball.distance / MAX_DISTANCE;

    // ball perspective at MIN distance

    if (ball.rawX > 400) {
      ball.x -= ball.radius * (ball.rawX - 400)/312;
    } else if (ball.rawX < 400) {
      ball.x += ball.radius * (400 - ball.rawX)/312;
    }

    if (ball.rawY > 300) {
      ball.y -= ball.radius * (ball.rawY - 300)/209;
    } else if (ball.rawY < 300) {
      ball.y += ball.radius * (300 - ball.rawY)/209;
    }

  }

  updateDistance() {
    const ball = this.stage.getChildByName('ball');

    if (ball.direction === "out") {
      ball.distance += 1;
    } else {
      ball.distance -= 1;
    }
  }

  detectHit() {
    const ball = this.stage.getChildByName('ball');

    if (ball.distance === MAX_DISTANCE){
      this.detectCpuPaddle();
      ball.direction = "in";
    } else if (ball.distance === 0){
      this.detectPlayerPaddle();
      ball.direction = "out";
    }
  }

  moveBall() {
    this.scaleBall();
    this.scaleTracker();
    this.addSpin();
    this.addVelocity();
    this.applyScaling();
    this.detectWalls();
    this.detectHit();
    this.updateDistance();

    this.stage.update();
  }

  hitBall(e) {
    e.remove();
    this.getSpin();

    this.ticker.addEventListener('tick', this.moveBall.bind(this));
  }


}

module.exports = Field;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Field = __webpack_require__(1);
const Ball = __webpack_require__(0);

const init = () => {
  const stage = new createjs.Stage("myCanvas");
  let field = new Field(stage);
};

document.addEventListener("DOMContentLoaded", init);

//
// class Game {
//
//   constructor() {
//     this.stage = this.stage || new createjs.Stage("myCanvas");
//     this.field = this.field || new Field(this.stage);
//
//     this.cpuLives = 3;
//     this.playerLives = 3;
//
//     this.cpuLives();
//     this.playerLives();
//     this.setStage();
//
//   }
//
//   setStage() {
//     const ball = this.stage.getChildByName('ball');
//     const tracker = this.stage.getChildByName('tracker');
//     ball.x = 400;
//     ball.y = 300;
//     ball.rawX = 400;
//     ball.rawY = 300;
//     ball.scaleX = 1;
//     ball.scaleY = 1;
//     ball.xVelocity = 0;
//     ball.yVelocity = 0;
//     ball.direction = "out";
//     ball.distance = 0;
//     ball.xSpin = 0;
//     ball.ySpin = 0;
//     tracker.graphics.clear().beginStroke("White").drawRect(88, 91, 624, 418);
//     this.stage.on('mousedown', this.field.hitBall.bind(this.field));
//   }
//
//   resetPieces(losingPlayer) {
//     if(losingPlayer === 'cpu') {
//       this.updateCpuLives();
//     } else {
//       this.playerLives -= 1;
//     }
//     setTimeout(this.setStage.bind(this), 1000);
//   }
//
//   updateCpuLives() {
//     if (this.cpuLives > 0) {
//       this.lives[this.cpuLives - 1].graphics.clear();
//       this.cpuLives -= 1;
//     } else {
//       this.printYouWon();
//     }
//   }
//
//   printYouWon() {
//     const text = new createjs.Text("You Win", "36px Arial", "White");
//     text.x = 400;
//     text.y = 300;
//
//     this.stage.addChild(text);
//
//     this.stage.update();
//   }
//
//   printCpuLives() {
//     this.lives = [];
//     for (let i = 0; i < this.cpuLives; i++) {
//       this.lives[i] = new createjs.Shape();
//       this.lives[i].graphics.beginFill("Red").drawCircle((160 + i * 25), 62, 10);
//
//       this.stage.addChild(this.lives[i]);
//     }
//   }
//
//
//   printPlayerLives() {
//
//   }
//
//   cpuText() {
//     const text = new createjs.Text("CPU", "20px Arial", "White");
//     text.x = 100;
//     text.y = 70;
//     text.textBaseline = "alphabetic";
//
//     this.stage.addChild(text);
//     this.stage.update();
//   }
//
//   playerText() {
//     const text = new createjs.Text("Player", "20px Arial", "White");
//     text.x = 450;
//     text.y = 70;
//
//     this.stage.addChild(text);
//     this.stage.update();
//   }
// }
//
// const init = () => {
//   const game = new Game;
// };
//
// document.addEventListener("DOMContentLoaded", init);
//
// export default Game;


/***/ })
/******/ ]);