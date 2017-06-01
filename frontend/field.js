let CENTER_X = 400;
let CENTER_Y = 300;
let MAX_DISTANCE = 100;

const init = () => {
  const stage = new createjs.Stage("myCanvas");

  const ball = new createjs.Shape();
  ball.graphics.beginFill("LimeGreen").drawCircle(0, 0, 35);

  ball.rawX = 400;
  ball.endX = (ball.rawX - 400) * 79/312 + 400; //ends up being 400 ??

  console.log(ball.endX);

  ball.rawY = 300;
  ball.endY = (ball.rawY - 300) * 53/209 + 300; //ends up being 300 ??

  renderField(stage);
  stage.addChild(ball);
  renderPaddles(stage);

  ball.direction = "out";
  ball.distance = 0;
  ball.xVelocity = 5;
  ball.yVelocity = -2;

  const tracker = new createjs.Shape();
  drawTracker(stage, tracker);
  setStage(ball, stage, tracker);

};

const setStage = (ball, stage, tracker) => {
  ball.x = 400;
  ball.y = 300;
  stage.on('stagemousedown', hitBall(ball, stage, tracker));
}

const drawTracker = (stage, tracker) => {
  tracker.graphics.beginStroke("White");
  tracker.graphics.setStrokeStyle(2);
  tracker.graphics.drawRect(88, 91, 624, 418);

  stage.addChild(tracker);
};

const hitBall = (ball, stage, tracker) => () => {
  const ticker = createjs.Ticker;
  createjs.Ticker.addEventListener('tick', scaleBall);
  createjs.Ticker.setFPS(80);

  function detectHit() {
    if (ball.x - (ball.radius - 10) <= stage.getChildByName('humanPaddle').x + 120
        && ball.x + (ball.radius - 10) >= stage.getChildByName('humanPaddle').x
        && ball.y - (ball.radius - 10) <= stage.getChildByName('humanPaddle').y + 60
        && ball.y + (ball.radius - 10) >= stage.getChildByName('humanPaddle').y) {
      console.log(`hit!`);
    } else {
      ticker.removeEventListener('tick', scaleBall);
    }
  }

  function scaleBall() {

    if (ball.direction === "out") {
      ball.distance += 1;
    } else {
      ball.distance -= 1;
    }

    if (ball.distance === MAX_DISTANCE) {
      ball.direction = "in";
    } else if (ball.distance === 0){
      ball.direction = "out";
    }

    const trackerX = 88 + ball.distance * (321 - 88) / MAX_DISTANCE;
    const trackerY = 91 + ball.distance * (247 - 91) / MAX_DISTANCE;
    const trackerW = 624 - ball.distance * (624 - 158) / MAX_DISTANCE;
    const trackerH = 418 - ball.distance * (418 - 106) / MAX_DISTANCE;
    tracker.graphics.clear().beginStroke("White").drawRect(trackerX, trackerY, trackerW, trackerH);

    // scales ball of 1/4 of size at MAX_DISTANCE
    ball.scaleX = 1 - ball.distance * 3 / (4 * MAX_DISTANCE);
    ball.scaleY = 1 - ball.distance * 3 / (4 * MAX_DISTANCE);

    ball.radius = 35 * ball.scaleX;

    //closest box right bound x = 712, left bound x = 88
    //            top boundy = 91, bottom bound y = 509

    //furthest box right bound x = 479, left bound x = 321
    //            top boundy = 353, bottom bound y = 247

    ball.rawX += ball.xVelocity;
    ball.endX = (ball.rawX - 400) * 79/312 + 400;

    if (ball.rawX >= 677 || ball.rawX <= 122) {
      ball.xVelocity = ball.xVelocity * -1;
    }

    ball.rawY += ball.yVelocity;
    ball.endY = (ball.rawY - 300) * 53/209 + 300;

    if (ball.rawY >= (512 - 35) || ball.rawY <= (92 + 35)) {
      ball.yVelocity = ball.yVelocity * -1;
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

const renderField = stage => {

  const border1 = new createjs.Shape();
  const border9 = new createjs.Shape();

  drawRectangle(stage, border1, { x: 88, y: 91, w: 624, h: 418 });
  drawRectangle(stage, border9, { x: 322, y: 247, w: 158, h: 106 });

  let cornerNW = new createjs.Shape();
  let cornerNE = new createjs.Shape();
  let cornerSE = new createjs.Shape();
  let cornerSW = new createjs.Shape();

  drawCorner(stage, cornerNW, { mtx: 88, mty: 91, ltx: 322, lty: 247 });
  drawCorner(stage, cornerNW, { mtx: 712, mty: 91, ltx: 479, lty: 247 });
  drawCorner(stage, cornerNW, { mtx: 712, mty: 509, ltx: 479, lty: 353 });
  drawCorner(stage, cornerNW, { mtx: 88, mty: 509, ltx: 322, lty: 353 });

};

const renderPaddles = stage => {
  let humanPaddle = new createjs.Shape();
  humanPaddle.graphics.beginStroke("DarkBlue");
  humanPaddle.graphics.setStrokeStyle(4);
  humanPaddle.snapToPixel = true;
  humanPaddle.graphics.drawRoundRect(0, 0, 120, 80, 10);

  let cpuPaddle = new createjs.Shape();
  cpuPaddle.graphics.beginStroke("Red");
  cpuPaddle.graphics.setStrokeStyle(2);
  cpuPaddle.snapToPixel = true;
  cpuPaddle.graphics.drawRoundRect(324, 250, 30, 20, 2);

  stage.addChild(cpuPaddle);
  stage.addChild(humanPaddle);

  createjs.Ticker.addEventListener('tick', cursor);
  createjs.Ticker.setFPS(60);

  function cursor(event){
    let difX;
    let difY;

    // console.log(stage.mouseX);
    // console.log(stage.mouseY);

    if (stage.mouseX < 652 && stage.mouseX > 148){
      difX = stage.mouseX - humanPaddle.x - 60;
    } else if (stage.mouseX <= 148){
      difX = 148 - humanPaddle.x - 60;
    } else {
      difX = 652 - humanPaddle.x - 60;
    }

    if (stage.mouseY < 432 && stage.mouseY > 131){
      difY = stage.mouseY - humanPaddle.y - 40;
    } else if (stage.mouseY <= 131){
      difY = 131 - humanPaddle.y - 40;
    } else {
      difY = 469 - humanPaddle.y - 40;
    }


    humanPaddle.x += difX/1.2;
    humanPaddle.y += difY/1.2;
    stage.update();
  }


};
