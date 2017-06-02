const Field = require('./field.js');
const Ball = require('./ball.js');

class Game {
  constructor() {
    this.stage = new createjs.Stage("myCanvas");
    this.field = new Field(this.stage);

    this.displayPlayer();
    this.displayCpu();

    this.playerLives();
    this.cpuLives();
  }


  displayCpu() {
    const text = new createjs.Text("CPU", "20px Arial", "White");
    text.x = 100;
    text.y = 45;

    this.stage.addChild(text);
    this.stage.update();
  }

  displayPlayer() {
    const text = new createjs.Text("Player", "20px Arial", "White");
    text.x = 650;
    text.y = 45;

    this.stage.addChild(text);
    this.stage.update();
  }
};

const init = () => {
  const game = new Game;
}

document.addEventListener("DOMContentLoaded", init);
