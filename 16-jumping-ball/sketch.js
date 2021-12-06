// Benedikt Groß

// setup wrap coordinates plugin
Matter.use('matter-wrap');

let ball;
let obstacle;
let slide;


function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  const engine = Matter.Engine.create();
  const world = engine.world;

  // config wrap area
  const wrap = {
    min: { x: 0, y: 0 },
    max: { x: width, y: height }
  };

  // create cirle, slide and obstacle
  ball = new Ball(world,
    { x: 300, y: 50, r: 40, color: 'white' },
    { restitution: 0, plugin: { wrap: wrap } }
  );
  slide = new Block(world,
    { x: 400, y: 350, w: 800, h: 40, color: 'grey' },
    { isStatic: true, angle: PI * 0.1 }
  );
  obstacle = new Block(world,
    { x: 400, y: 310, w: 40, h: 40, color: 'grey' },
    { isStatic: true, angle: PI * 0.1 }
  );

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Engine.run(engine);
}

function draw() {
  background('black');

  ball.draw();
  slide.draw();
  obstacle.draw();
  mouse.draw();

  fill(255);
  textAlign(CENTER, CENTER);
  text('Press SPACE', width/2, 50);
}

function keyPressed() {
  // is SPACE pressed?
  if (keyCode === 32) {
    let direction = 1; // ball runs left to right ->
    if ((ball.body.position.x - ball.body.positionPrev.x) < 0) {
      direction = -1; // ball runs right to left <-
    }
    // use current direction and velocity for the jump
    Matter.Body.applyForce(
      ball.body,
      {x: ball.body.position.x, y: ball.body.position.y},
      {x: (0.01 * direction) + ball.body.velocity.x / 100, y: -0.1}
    );
  }
}
