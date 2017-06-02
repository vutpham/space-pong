let CENTER_X = 400;
let CENTER_Y = 300;
let MAX_DISTANCE = 100;

class Field {
  constructor(stage) {
    this.stage = stage;
    this.renderField();
    this.gamePieces();
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
  }

  gamePieces() {
    this.createPlayerPaddle();
    this.createBall();
    this.createAiPaddle();

    createjs.Ticker.addEventListener('tick', this.movePaddles.bind(this));
    createjs.Ticker.setFPS(60);
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


const init = () => {
  const stage = new createjs.Stage("myCanvas");

  let field = new Field(stage)

  const tracker = new createjs.Shape();
  drawTracker(stage, tracker);
  setStage(stage.getChildByName('ball'), stage, tracker)();

};

const setStage = (ball, stage, tracker) => () => {
  ball.x = 400;
  ball.y = 300;
  ball.rawX = 400;
  ball.rawY = 300;
  ball.scaleX = 1;
  ball.scaleY = 1;
  ball.xVelocity = 0;
  ball.yVelocity = 0;
  ball.direction = "out";
  ball.distance = 0;
  ball.xSpin = 0;
  ball.ySpin = 0;
  stage.on('mousedown', hitBall(ball, stage, tracker));
};

const drawTracker = (stage, tracker) => {
  tracker.graphics.beginStroke("White");
  tracker.graphics.setStrokeStyle(2);
  tracker.graphics.drawRect(88, 91, 624, 418);

  stage.addChild(tracker);
};

const hitBall = (ball, stage, tracker) => (e) => {
  e.remove();
  const humanPaddle = stage.getChildByName('humanPaddle');
  const cpuPaddle = stage.getChildByName('cpuPaddle');

  ball.xSpin += humanPaddle.x - humanPaddle.prevX;
  ball.ySpin += humanPaddle.y - humanPaddle.prevY;


  const ticker = createjs.Ticker;
  createjs.Ticker.addEventListener('tick', scaleBall);
  createjs.Ticker.setFPS(60);

  function detectHumanHit() {
    if (ball.x - (ball.radius) <= humanPaddle.x + 120
        && ball.x + (ball.radius) >= humanPaddle.x
        && ball.y - (ball.radius) <= humanPaddle.y + 60
        && ball.y + (ball.radius) >= humanPaddle.y) {
      console.log(`${humanPaddle.x}, ${humanPaddle.prevX}`);
      ball.xSpin += humanPaddle.x - humanPaddle.prevX;
      ball.ySpin += humanPaddle.y - humanPaddle.prevY;
    } else {
      console.log('else --- human hit');
      ticker.removeEventListener('tick', scaleBall);
      setTimeout(setStage(ball, stage, tracker), 1000);
    }
  }

  function detectCpuHit() {
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


  function scaleBall() {

    if (ball.distance === MAX_DISTANCE) {
      console.log(ball.x);
      console.log(ball.y);
      detectCpuHit();
      ball.direction = "in";
    } else if (ball.distance === 0){
      console.log('detected hit');
      detectHumanHit();
      ball.direction = "out";
    }

    if (ball.direction === "out") {
      ball.distance += 1;
    } else {
      ball.distance -= 1;
    }

    ball.rotation += 8;


    const trackerX = 88 + ball.distance * (322 - 88) / MAX_DISTANCE;
    const trackerY = 91 + ball.distance * (247 - 91) / MAX_DISTANCE;
    const trackerW = 624 - ball.distance * (624 - 158) / MAX_DISTANCE;
    const trackerH = 418 - ball.distance * (418 - 106) / MAX_DISTANCE;
    tracker.graphics.clear().beginStroke("White").drawRect(trackerX, trackerY, trackerW, trackerH);

    // scales ball of 1/3 of size at MAX_DISTANCE
    ball.scaleX = 1 - ball.distance * 2 / (3 * MAX_DISTANCE);
    ball.scaleY = 1 - ball.distance * 2 / (3 * MAX_DISTANCE);

    ball.radius = 35 * ball.scaleX;

    ball.rawX += ball.xVelocity;
    ball.endX = (ball.rawX - 400) * 79/312 + 400;

    ball.xVelocity -= ball.xSpin / MAX_DISTANCE;
    ball.yVelocity -= ball.ySpin / MAX_DISTANCE;

    //closest box right bound x = 712, left bound x = 88
    //            top boundy = 91, bottom bound y = 509

    //furthest box right bound x = 479, left bound x = 321
    //            top boundy = 353, bottom bound y = 247

    if (ball.rawX >= 677 || ball.rawX <= 122) {
      ball.xVelocity = ball.xVelocity * -1;
      ball.xSpin = 0;
    }

    ball.rawY += ball.yVelocity;
    ball.endY = (ball.rawY - 300) * 53/209 + 300;

    if (ball.rawY >= (512 - 35) || ball.rawY <= (92 + 35)) {
      ball.yVelocity = ball.yVelocity * -1;
      ball.ySpin = 0;
    }

    ball.x = ball.rawX - (ball.rawX - ball.endX) * ball.distance / MAX_DISTANCE;
    ball.y = ball.rawY - (ball.rawY - ball.endY) * ball.distance / MAX_DISTANCE;

    stage.update();
  }
};

const drawRectangle = (stage, shape, { x, y, w, h }) => {
  shape.graphics.beginStroke("Yellow");
  shape.graphics.setStrokeStyle(1);
  shape.snapToPixel = true;
  shape.graphics.drawRect(x, y, w, h);

  stage.addChild(shape);
};

const drawCorner = (stage, shape, { mtx, mty, ltx, lty }) => {
  shape.graphics.beginStroke("Yellow");
  shape.graphics.setStrokeStyle(1);
  shape.snapToPixel = true;
  shape.graphics.moveTo(mtx, mty);
  shape.graphics.lineTo(ltx, lty);

  stage.addChild(shape);
};

};
