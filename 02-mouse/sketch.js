// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

let blockA;
let blockB;
let ball;
let ground;
let mouse;

function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  let engine = Matter.Engine.create();
  let world = engine.world;

  // create two boxes and a ground
  blockA = new Block(world, { x: 200, y: 200, w: 80, h: 80, color: 'white' });
  blockB = new Block(world, { x: 270, y: 50, w: 160, h: 80, color: 'white' });
  ball = new Ball(world, { x: 100, y: 50, r: 40, color: 'white' });
  ground = new Block(
    world,
    { x: 400, y: 500, w: 810, h: 15, color: 'grey' },
    { isStatic: true, angle: PI/36 }
  );

  mouse = new Mouse(world, engine, canvas, 'green');

  // run the engine
  Matter.Engine.run(engine);
}

function draw() {
  background(0);
  blockA.draw();
  blockB.draw();
  ground.draw();
  ball.draw();
  mouse.draw();
}
