let ball;
let ground;
let mouse;

function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  let engine = Matter.Engine.create();
  let world = engine.world;

  // load image
  const spriteImg = loadImage('up.png');

  // ball and ground
  ball = new Ball(
    world,
    { x: 350, y: 50, r: 100, color: 'white', image: spriteImg },
    { restitution: 0.5, frictionAir: 0.001 } // bouncy
  );
  setMassCentre(ball, { x: 0, y: 50 });

  ground = new Block(
    world,
    { x: 400, y: height, w: 1000, h: 59, color: 'grey' },
    { isStatic: true }
  );

  // add a mouse to manipulate Matter objects
  mouse = new Mouse(engine, canvas, { stroke: 'magenta', strokeWeight: 2 });

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background('black');
  ground.draw();
  ball.draw();
  mouse.draw();
}

function setMassCentre(block, offset) {
  block.body.position.x += offset.x;
  block.body.position.y += offset.y;
  block.body.positionPrev.x += offset.x;
  block.body.positionPrev.y += offset.y;
}
