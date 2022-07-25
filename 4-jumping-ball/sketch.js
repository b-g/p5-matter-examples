Matter.use('matter-wrap');

let ball;
let obstacle;
let slide;
let characterTouchingASurface = false


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
    { restitution: 0, plugin: { wrap: wrap }, label: 'character'}
  );
  slide = new Block(world,
    { x: 400, y: 350, w: 800, h: 40, color: 'grey' },
    { isStatic: true, angle: PI * 0.1 }
  );
  obstacle = new Block(world,
    { x: 400, y: 310, w: 40, h: 40, color: 'grey' },
    { isStatic: true, angle: PI * 0.1 }
  );

  // Check if character is touching a surface (e.g. the ground) so we know when it should be able to jump
  Matter.Events.on(engine, 'collisionStart', function(event) {
    const pairs = event.pairs[0];
    const bodyA = pairs.bodyA;
    const bodyB = pairs.bodyB;
    if (bodyA.label === "character" || bodyB.label === "character") {
      characterTouchingASurface = true
    }
  });

  Matter.Events.on(engine, 'collisionEnd', function(event) {
    const pairs = event.pairs[0];
    const bodyA = pairs.bodyA;
    const bodyB = pairs.bodyB;
    if (bodyA.label === "character" || bodyB.label === "character") {
      characterTouchingASurface = false
    }
  });

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
  text('Press SPACE', width/2, 50);
}

function keyPressed() {
  // is SPACE pressed and character touching a surface?
  if (keyCode === 32 && characterTouchingASurface === true) {
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
