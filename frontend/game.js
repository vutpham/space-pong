import Field from './field';
import Ball from './ball';

const FONT = 'Coda';

class Game {

  constructor() {
    this.stage = this.stage || new createjs.Stage("myCanvas");
    this.stage.canvas.style.cursor = "none";

    this.cpuStrikes = 2;
    this.humanStrikes = 5;
    this.level = 1;

    this.field = new Field(this.stage, this);

    this.playDemo();
    this.handleKeydown();
  }

  playDemo() {
    this.field.ball.xSpin = -20;
    this.field.ball.ySpin = -30;
    this.field.ball.maxDistance = 50;
    this.field.maxDistance = 50;
    this.field.hitBall();
    this.buildInstructions();
    this.flashInstructions();

    this.startGame = this.startGame.bind(this);
    document.addEventListener('mousedown', this.startGame);
  }

  buildInstructions() {
    const text = new createjs.Text("CLICK TO START", `20px ${FONT}`, "#FA9F42");
    text.x = 330;
    text.y = 462;
    text.textBaseline = "alphabetic";
    this.instructions = text;

    this.tips = [];
    this.tips[0] = new createjs.Text("", `20px ${FONT}`, "ghostwhite");
    this.tips[0].x = 200;
    this.tips[0].y = 5;

    this.tips[1] = new createjs.Text("CLICK TO SERVE", `20px ${FONT}`, "ghostwhite");
    this.tips[1].x = 320;
    this.tips[1].y = 5;

    this.tips[2] = new createjs.Text("CURVE THE BALL WITH YOUR PADDLE", `20px ${FONT}`, "ghostwhite");
    this.tips[2].x = 225;
    this.tips[2].y = 30;

    this.tips[3] = new createjs.Text("USE CURVE TO BEAT THE CPU!", `20px ${FONT}`, "ghostwhite");
    this.tips[3].x = 260;
    this.tips[3].y = 55;

    this.tips.forEach( (tip, index) => {
      this.stage.addChild(tip);
    });
  }

  flashInstructions() {
    this.interval = setInterval( () => this.toggleChild(this.instructions), 500);
  }

  clearInstructions() {
    clearInterval(this.interval);
    this.removeChild(this.instructions);
  }

  removeChild(child) {
    if (this.stage.contains(child)) {
      this.stage.removeChild(child);
    }
    this.stage.update();
  }

  toggleChild(child) {
    if (this.stage.contains(child)) {
      this.stage.removeChild(child);
    } else {
      this.stage.addChild(child);
    }
    this.stage.update();
  }

  startGame() {
    this.clearInstructions();
    this.buildCpuScore();
    this.buildHumanScore();
    this.printLevel();
    document.removeEventListener('mousedown', this.startGame);
    this.field.audio = true;
    this.field.humanPaddle.demo = false;
    this.field.cpuPaddle.demo = false;
    this.restart();
  }

  toggleAudio() {
    this.field.audio = !this.field.audio;
  }

  handleKeydown() {
    document.addEventListener('keydown', this.toggleAudio.bind(this));
  }

  buildCpuScore() {
    const text = new createjs.Text("CPU", `20px ${FONT}`, "ghostwhite");
    text.x = 100;
    text.y = 70;
    text.textBaseline = "alphabetic";

    this.stage.addChild(text);
    this.buildCpuStrikes();

    this.stage.update();
  }

  buildCpuStrikes() {
    this.cpuStrikeShapes = [];
    for (let i = 0; i < this.cpuStrikes; i++) {
      this.cpuStrikeShapes[i] = new createjs.Shape();
      this.cpuStrikeShapes[i].graphics.beginFill("#cc0000").drawCircle((160 + i * 25), 62, 10);

      this.stage.addChild(this.cpuStrikeShapes[i]);
    }
  }

  buildHumanScore() {
    const text = new createjs.Text("Player", `20px ${FONT}`, "ghostwhite");
    text.x = 650;
    text.y = 70;
    text.textBaseline = "alphabetic";

    this.stage.addChild(text);
    this.buildHumanStrikes();

    this.stage.update();
  }

  buildHumanStrikes() {
    this.humanStrikeShapes = [];
    for (let i = 0; i < this.humanStrikes; i++) {
      this.humanStrikeShapes[i] = new createjs.Shape();
      this.humanStrikeShapes[i].graphics.beginFill("royalblue").drawCircle((630 - i * 25), 62, 10);

      this.stage.addChild(this.humanStrikeShapes[i]);
    }
  }

  printGameOver() {
    const frame = new createjs.Shape();
    frame.graphics
      .beginFill("black")
      .drawRoundRect(255, 250, 290, 100, 5);

    const gameOver = new createjs.Text(`Game Over`, `42px ${FONT}`, "#E0E0E2");
    gameOver.x = 290;
    gameOver.y = 300;
    gameOver.textBaseline = "alphabetic";

    const spaceText = new createjs.Text(`Click to restart`, `22px ${FONT}`, "ghostwhite");
    spaceText.x = 330;
    spaceText.y = 330;
    spaceText.textBaseline = "alphabetic";

    this.stage.addChild(frame);
    this.stage.addChild(gameOver);
    this.stage.addChild(spaceText);

    this.stage.update();

    this.stage.on('mousedown', this.restart.bind(this));
  }

  printLevel() {
    const frame = new createjs.Shape();
    frame.graphics
      .beginFill("black")
      .drawRoundRect(298, 530, 200, 45, 5);

    const text = new createjs.Text(`Level ${this.level}`, `40px ${FONT}`, "#FA9F42");
    text.x = 340;
    text.y = 565;
    text.textBaseline = "alphabetic";
    text.name = "level";

    this.stage.addChild(frame);
    this.stage.addChild(text);

    this.stage.update();
  }

  resetPieces(loser) {
    if(loser === 'cpu') {
      this.updateCpuStrikes();
    } else {
      this.updateHumanStrikes();
    }
  }

  restart() {
    this.stage.removeAllEventListeners();
    this.field.ticker.removeAllEventListeners();
    this.stage.removeAllChildren();

    this.cpuStrikes = 2;
    this.humanStrikes = 5;
    this.level = 1;

    let audio = this.field.audio;

    this.field = new Field(this.stage, this);
    this.field.humanPaddle.demo = false;
    this.field.cpuPaddle.demo = false;
    this.field.audio = audio;

    this.buildCpuScore();
    this.buildHumanScore();
    this.printLevel();
    this.setStage();
  }

  setStage() {
    const ballMarker = this.stage.getChildByName('ballMarker');

    this.field.ball.reset();
    ballMarker.graphics.clear().beginStroke("#444").drawRect(88, 91, 624, 418);
    this.stage.on('stagemousedown', this.field.hitBall.bind(this.field));
  }

  updateCpuStrikes() {
    if(this.cpuStrikes > 0){
      this.cpuStrikeShapes[this.cpuStrikes - 1].graphics.clear();
      this.cpuStrikes -= 1;
    } else {
      const level = this.stage.getChildByName('level');
      this.level += 1;
      level.text = `Level ${this.level}`
      this.field.cpuTrackingRatio = this.field.cpuTrackingRatio / 1.4 ;
      this.cpuStrikes = 2;
      setTimeout( () => {
        this.field.ball.maxDistance = Math.floor(this.field.ball.maxDistance * 0.95);
        this.field.maxDistance = this.field.ball.maxDistance;
      }, 1000);
      setTimeout(this.buildCpuStrikes.bind(this), 1000);
    }
    setTimeout(this.setStage.bind(this), 1000);
  }

  updateHumanStrikes() {
    if(this.humanStrikes > 0){
      this.humanStrikeShapes[this.humanStrikes - 1].graphics.clear();
      this.humanStrikes -= 1;
      setTimeout(this.setStage.bind(this), 1000);
    } else {
      setTimeout(this.printGameOver.bind(this), 1000);
    }
  }
}

const init = () => {
  const game = new Game;
};

document.addEventListener("DOMContentLoaded", init)
