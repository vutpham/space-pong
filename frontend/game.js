const Field = require('./field.js');
const Ball = require('./ball.js');

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
