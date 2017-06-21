const Field = require('./field.js');
const Ball = require('./ball.js');

class Game {
  constructor() {
    this.stage = new createjs.Stage("myCanvas");
    this.field = new Field(this.stage, this);

    this.cpuLives = 3;
    this.playerLives = 3;

    this.displayPlayer();
    this.displayCpu();
    this.setStage();
  }

  setStage() {
    const ball = this.stage.getChildByName('ball');
    const tracker = this.stage.getChildByName('tracker');
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
    tracker.graphics.clear().beginStroke("White").drawRect(88, 91, 624, 418);
    console.log(this);
    this.stage.on('mousedown', this.field.hitBall.bind(this.field));
  }

  resetPieces(losingPlayer) {
    if (losingPlayer === 'cpu') {
      this.updateCpuLives();
    } else {
      this.updatePlayerLives();
    }
    setTimeout(this.setStage.bind(this), 1000);
  }


  // Displays Player/CPU & Lives
  displayCpu() {
    const text = new createjs.Text("CPU", "20px Arial", "White");
    text.x = 100;
    text.y = 52;

    this.stage.addChild(text);
    this.showCpuLives();

    this.stage.update();
  }

  displayPlayer() {
    const text = new createjs.Text("Player", "20px Arial", "White");
    text.x = 650;
    text.y = 52;

    this.stage.addChild(text);
    this.showPlayerLives();
    this.stage.update();
  }

  // Logic to update lives
  updateCpuLives() {
    if (this.cpuLives > 0) {
      this.cpuLivesStock[this.cpuLives - 1].graphics.clear();
      this.cpuLives -= 1;
    } else {
      setTimeout(this.showCpuLives.bind(this), 1000);
    }
    setTimeout(this.setStage.bind(this), 1000);
  }

  updatePlayerLives() {
    if (this.playerLives > 0) {
      this.playerLivesStock[this.playerLives - 1].graphics.clear();
      this.playerLives -= 1;
      setTimeout(this.setStage.bind(this), 1000);
    } else {
      this.printGameOver();
    }
  }

  printYouWon() {
    const text = new createjs.Text("You Win", "36px Arial", "Red");
    text.x = 350;
    text.y = 300;
    text.textBaseline = "alphabetic";

    this.stage.addChild(text);
    setTimeout(this.setStage.bind(this), 1000);
    this.stage.removeChild(text);
    this.stage.update();
  }

  // Show lives stocks
  showPlayerLives() {
    this.playerLivesStock = [];
    for (let i = 0; i < this.playerLives; i++) {
      this.playerLivesStock[i] = new createjs.Shape();
      this.playerLivesStock[i].graphics
      .beginFill("Yellow")
      .drawCircle((630 - i * 25), 62, 10);
      this.stage.addChild(this.playerLivesStock[i]);
    }
  }

  showCpuLives() {
    this.cpuLivesStock = [];
    for (let i = 0; i < this.cpuLives; i++) {
      this.cpuLivesStock[i] = new createjs.Shape();
      this.cpuLivesStock[i].graphics
      .beginFill("White")
      .drawCircle((160 + i * 25), 62, 10);
      this.stage.addChild(this.cpuLivesStock[i]);
    }
  }

  printGameOver() {
    const frame = new createjs.Shape();
    frame.graphics
      .beginFill("#555")
      .drawRoundRect(275, 250, 250, 100, 5);

    const gameOver = new createjs.Text(`Game Over`, "42px Arial", "#FFF");
    gameOver.x = 290;
    gameOver.y = 315;
    gameOver.textBaseline = "alphabetic";

    const spaceText = new createjs.Text(`Click to restart`, "24px Arial", "#FFF8F0");
    spaceText.x = 320;
    spaceText.y = 550;
    spaceText.textBaseline = "alphabetic";

    this.stage.addChild(frame);
    this.stage.addChild(gameOver);
    this.stage.addChild(spaceText);

    this.stage.update();

    this.stage.on('mousedown', this.restart.bind(this));
  }

  resetPieces(loser) {
    if(loser === 'cpu') {
      this.updateCpuLives();
    } else {
      this.updatePlayerLives();
    }
  }

  restart() {
    this.stage.removeAllEventListeners();
    this.field.ticker.removeAllEventListeners();
    this.stage.removeAllChildren();

    this.cpuStrikes = 3;
    this.humanStrikes = 3;

    this.field = new Field(this.stage, this);

    this.displayCpu();
    this.displayPlayer();
    this.setStage();
  }

}

const init = () => {
  const game = new Game;
};

document.addEventListener("DOMContentLoaded", init);
