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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
let CENTER_X = 400;
let CENTER_Y = 300;
let MAX_DISTANCE = 100;

class Field {
  constructor(stage) {
    this.stage = stage;
    this.renderField();
    this.gamePieces();

    this.ticker = createjs.Ticker;
    this.ticker.setFPS(60);

    this.setStage();
  }

  createPlayerPaddle() {
    const humanPaddle = new createjs.Shape();
    humanPaddle.graphics
      .beginStroke("DarkBlue")
      .setStrokeStyle(4)
      .beginFill("LightBlue")
      .drawRoundRect(0, 0, 120, 80, 10);
    humanPaddle.name = 'humanPaddle';
    humanPaddle.alpha= 0.5;
    humanPaddle.prevX = 0;
    humanPaddle.prevY = 0;

    this.stage.addChild(humanPaddle);
  }

  createAiPaddle() {
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
      .drawPolyStar(0, 0, 40, 10, 0.1);
    ball.name = 'ball';

    this.stage.addChild(ball);
    this.drawTracker();
  }

  scaleBall() {
    ball.scaleX = 1 - ball.distance * 2 / (3 * MAX_DISTANCE);
    ball.scaleY = 1 - ball.distance * 2 / (3 * MAX_DISTANCE);

    ball.radius = 35 * ball.scaleX;
  }

  gamePieces() {
    this.createPlayerPaddle();
    this.createBall();
    this.createAiPaddle();

    createjs.Ticker.addEventListener('tick', this.movePaddles.bind(this));
  }

  movePlayerPaddle() {
    const playerPaddle = this.stage.getChildByName('humanPaddle');

    let difX;
    let difY;

    // console.log(stage.mouseX);
    // console.log(stage.mouseY);

    if (this.stage.mouseX < 652 && this.stage.mouseX > 148){
      difX = this.stage.mouseX - humanPaddle.x - 60;
    } else if (this.stage.mouseX <= 148){
      difX = 148 - humanPaddle.x - 60;
    } else {
      difX = 652 - humanPaddle.x - 60;
    }

    if (this.stage.mouseY < 432 && this.stage.mouseY > 131){
      difY = this.stage.mouseY - humanPaddle.y - 40;
    } else if (this.stage.mouseY <= 131){
      difY = 131 - humanPaddle.y - 40;
    } else {
      difY = 469 - humanPaddle.y - 40;
    }

    humanPaddle.prevX = humanPaddle.x;
    humanPaddle.prevY = humanPaddle.y;
    humanPaddle.x += difX/1.2;
    humanPaddle.y += difY/1.2;
  }

  moveAiPaddle() {
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
    this.moveHumanPaddle();
    this.moveCpuPaddle();
    this.stage.update();
  }

  createField() {
    const borderFront = new createjs.Shape();
    const borderEnd = new createjs.Shape();

    drawRectangle(this.stage, borderFront, { x: 88, y: 91, w: 624, h: 418 });
    drawRectangle(this.stage, borderEnd, { x: 322, y: 247, w: 158, h: 106 });

    let cornerNW = new createjs.Shape();
    let cornerNE = new createjs.Shape();
    let cornerSE = new createjs.Shape();
    let cornerSW = new createjs.Shape();

    drawCorner(this.stage, cornerNW, { mtx: 88, mty: 91, ltx: 322, lty: 247 });
    drawCorner(this.stage, cornerNW, { mtx: 712, mty: 91, ltx: 479, lty: 247 });
    drawCorner(this.stage, cornerNW, { mtx: 712, mty: 509, ltx: 479, lty: 353 });
    drawCorner(this.stage, cornerNW, { mtx: 88, mty: 509, ltx: 322, lty: 353 });
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
    const playerPaddle = this.stage.getChildByName('humanPaddle');

    if (ball.x - (ball.radius) <= humanPaddle.x + 120
        && ball.x + (ball.radius) >= humanPaddle.x
        && ball.y - (ball.radius) <= humanPaddle.y + 60
        && ball.y + (ball.radius) >= humanPaddle.y) {
      console.log(`${humanPaddle.x}, ${humanPaddle.prevX}`);
      ball.xSpin += humanPaddle.x - humanPaddle.prevX;
      ball.ySpin += humanPaddle.y - humanPaddle.prevY;
    } else {
      console.log('else --- human hit');
      this.ticker.removeAllEventListeners('tick');
      this.ticker.addEventListener('tick', this.movePaddles.bind(this));
      setTimeout(this.setStage.bind(this), 1000);
    }
  }

  detectAiPaddle() {
    const ball = this.stage.getChildByName('ball');
    const cpuPaddle = this.stage.getChildByName('cpuPaddle');

    if (ball.x - 400 - (ball.radius - 2) <= cpuPaddle.x + 15
        && ball.x - 400 + (ball.radius - 2) >= cpuPaddle.x - 15
        && ball.y - 300 - (ball.radius - 2) <= cpuPaddle.y + 10
        && ball.y - 300 + (ball.radius - 2) >= cpuPaddle.y - 10) {
      console.log(`cpu hit!`);
    } else {
      console.log('no hit');
      ticker.removeEventListener('tick', scaleBall);
      setTimeout(setStage(ball, stage, tracker), 1000);
    }
  }

  getSpin() {
    const ball = this.stage.getChildByName('ball');
    const playerPaddle = this.stage.getChildByName('humanPaddle');

    ball.xSpin += humanPaddle.x - humanPaddle.prevX;
    ball.ySpin += humanPaddle.y - humanPaddle.prevY;
  }

  addSpin(){
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

  };

  updateDistance() {
    const ball = this.stage.getChildByName('ball');

    if (ball.direction === "out") {
      ball.distance += 1;
    } else {
      ball.distance -= 1;
    }
  };

  detectHit() {
    const ball = this.stage.getChildByName('ball');

    if (ball.distance === MAX_DISTANCE){
      this.detectCpuHit();
      ball.direction = "in";
    } else if (ball.distance === 0){
      this.detectHumanHit();
      ball.direction = "out";
    }
  };

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
  };

  hitBall() {
    e.remove();
    this.getSpin();

    this.ticker.addEventListener('tick', this.moveBall.bind(this));
  };

}

/* harmony default export */ __webpack_exports__["default"] = (Field);


/***/ })
/******/ ]);