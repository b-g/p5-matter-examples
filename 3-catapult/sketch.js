// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

let ground;
let ball1;
let ball2;
let catapult;
let catapultSpacer;
let mouse;


function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  let engine = Matter.Engine.create();
  let world = engine.world;

  catapult = new Block(world, { x: 400, y: 520-20, w: 600, h: 50, color: 'white' });
  // add revolute constraint for catapult
  catapult.constrainTo(null, { stiffness: 1, length: 0 });

  // balls and catapult spacer for limit
  catapultSpacer = new Block(world, { x: 150, y: 555, w: 20, h: 50, color: 'white' }, {isStatic: true });
  ball1 = new Ball(world, { x: 600, y: 100, r: 50, color: 'white' }, {density: 0.01}); // make big one more 'heavy'
  ball2 = new Ball(world, { x: 110, y: 450, r: 20, color: 'white' });

  // ground
  ground = new Block(world, { x: 400, y: height-10, w: 810, h: 25, color: 'white' }, {isStatic: true });

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background(0);
  ground.draw();
  ball1.draw();
  ball2.draw();
  catapult.draw();
  catapult.drawConstraints();
  catapultSpacer.draw();
}
