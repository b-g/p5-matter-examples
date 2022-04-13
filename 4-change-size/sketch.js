Matter.use('matter-wrap');

let engine;
let ball;
let obstacle;
let slide;

let isSmall = false;


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
    { x: 200, y: 50, r: 40, color: 'white' },
    { restitution: 0, plugin: { wrap: wrap } }
  );
  slide = new Block(world,
    { x: 400, y: 350, w: 700, h: 40, color: 'grey' },
    { isStatic: true, angle: PI * 0.1 }
  );
  obstacle = new Block(world,
    { x: 400, y: 310, w: 40, h: 40, color: 'grey' },
    { isStatic: true, angle: PI * 0.1 }
  );

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background('black');

  ball.draw();
  slide.draw();
  obstacle.draw();
  mouse.draw();

  fill(255);
  textAlign(CENTER, CENTER);
  text('Jump: SPACE, Scale: S', width/2, 50);
}

function keyPressed() {
  if (keyCode === 32) {
    if (isSmall) {
      Matter.Body.applyForce(
        ball.body,
        {x: ball.body.position.x, y: ball.body.position.y},
        {x: 0.03, y: -0.45}
      );
      console.log('big');
    } else {
      Matter.Body.applyForce(
        ball.body,
        {x: ball.body.position.x, y: ball.body.position.y},
        {x: 0.01, y: -0.1}
      );
    }
  }
  if (key === 's' || key === 'S') {
    if (isSmall) {
      Matter.Body.scale(ball.body, 0.5, 0.5);
    } else {
      Matter.Body.scale(ball.body, 2, 2);
    }
    isSmall = !isSmall; // toggle isSmall variable
  }
}
