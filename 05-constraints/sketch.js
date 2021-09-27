// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

let swingStiff;
let swingStreched;
let propeller;
let polyConnectedA;
let polyConnectedB;

let ball;
let ground;
let mouse;


function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  let engine = Matter.Engine.create();
  let world = engine.world;

  // add stiff global constraint
  swingStiff = new Polygon(world, {x: 300, y: 200, s: 5, r: 100, color: 'white'});
  swingStiff.constrainTo(null, {
    pointA: { x: -10, y: -20 }, length: 150
  });

  // add damped soft global constraint
  swingStreched = new Polygon(world, {x: 400, y: 100, s: 8, r: 50, color: 'white'});
  swingStreched.constrainTo(null, {
    pointA: { x: -10, y: -20 }, length: 150, stiffness: 0.001, damping: 0.05
  });

  // add revolute constraint
  propeller = new Block(world, { x: 600, y: 200, w: 300, h: 20, color: 'white' });
  propeller.constrainTo(null, { length: 0, stiffness: 1 });

  // add stiff multi-body constraint
  polyConnectedA = new Polygon(world, {x: 100, y: 400, s: 6, r: 20, color: 'white'});
  polyConnectedB = new Polygon(world, {x: 200, y: 400, s: 6, r: 20, color: 'white'});
  polyConnectedA.constrainTo(polyConnectedB, { length: 100, stiffness: 0.01 });

  // add a ball3 to play with the constraint
  ball = new Ball(world, {x: 550, y:150, r:20, color: 'white'});

  // ground
  ground = new Block(world, {x:400, y: height-10, w: 810, h: 30, color: 'white'}, {isStatic: true});

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Engine.run(engine);
}

function draw() {
  background('black');

  swingStiff.draw();
  swingStiff.drawConstraint();

  swingStreched.draw();
  swingStreched.drawConstraint();

  polyConnectedA.draw();
  polyConnectedB.draw();
  polyConnectedA.drawConstraint();

  propeller.draw();
  propeller.drawConstraint();
  ball.draw();
  ground.draw();
  mouse.draw();
}
