import Field from './field.js';
// import Ball from './ball.js';

class Game {

  constructor() {
    this.stage = this.stage || new createjs.Stage("myCanvas");
    this.field = new Field(this.stage);

    this.cpuText();
    this.playerText();

    this.cpuLives = 3;
    this.playerLives = 3;
  }

  cpuText() {
    const text = new createjs.Text("CPU", "20px Arial", "#FFF8F0");
    text.x = 100;
    text.y = 70;
    text.textBaseline = "alphabetic";

    this.stage.addChild(text);
    this.stage.update();
  }

  playerText() {
    const text = new createjs.Text("Player", "20px Arial", "White");
    text.x = 450;
    text.y = 70;

    this.stage.addChild(text);
    this.stage.update();
  }
}

const init = () => {
  const game = new Game;
};

document.addEventListener("DOMContentLoaded", init);

export default Game;
