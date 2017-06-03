# Pong 3D

Pong 3D is a pure Javascript and HTML adaptation of Curveball, a three-dimensional version of the classic pong game.

![img]

## Instructions

The objective of the game is to be the first to score three goals on your opponent. By moving your cursor when the ball hits your paddle, you can apply spin to the ball to make it more challenging for your opponent to respond.

In order to start playing, click on the ball and move your paddle around to prevent the CPU player from scoring.

## Technology/Languages Used

Pong 3D is written in plain Vanilla Javascript and the game pieces (playing field, ball, and paddles) were created using the Easel.js API.

Technologies Used:

- `Plain Vanilla Javascript`
- `HTML5 Canvas`
- `Easel.js`
- `CSS3`

### Easel.js

#### Object Creation

```javascript
//field.js

createBall() {
  // creation of ball using Easel.js
  const ball = new createjs.Shape();
  ball.graphics
    .beginFill("ghostwhite")
    .drawPolyStar(0, 0, 35, 10, 0.1);
  ball.name = 'ball';

  // logic for ball tracker
  this.createTracker();

  // appends ball to stage
  this.stage.addChild(ball);
}
```

#### Ticker Object

The Ticker is provided by Easel.js and updates the game objects at a rate of 60 FPS.

```javascript

// field.js
this.ticker = createjs.Ticker;
this.ticker.setFPS(60);
this.ticker.addEventListener('tick', this.moveBall.bind(this));
```

#### 3d Rendering

```javascript

// distance is updated by the tick event listener and the moveBall function

updateDistance() {
  const ball = this.stage.getChildByName('ball');

  if (ball.direction === "out") {
    ball.distance += 1;
  } else {
    ball.distance -= 1;
  }
}
```

At MAX_DISTANCE, the ball is scaled to 1/3 of its original size:

```javascript

ball.scaleX = 1 - ball.distance * 2 / (3 * MAX_DISTANCE);
ball.scaleY = 1 - ball.distance * 2 / (3 * MAX_DISTANCE);
ball.radius = 35 * ball.scaleX;
```

#### Spin and Curving
Spin is applied whenever the paddle hits the ball. Capturing the start and ending coordinates allows us to apply the intensity of the spin to the ball to the velocity and scale it with distance.

```javascript
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
```

#### CPU AI
The CPU AI tracks the ball's position by comparing the ball's and paddle's position.  The CPU paddle makes up 1/25 of the distance between it and the ball.

In the future, when levels are added, the distance between the CPU paddle and the ball would lessen.

## Future Implementations

- [ ] Sounds
- [ ] Levels
- [ ] PvP Features
