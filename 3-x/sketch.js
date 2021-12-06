// Benedikt Groß

let rect1;
let rect2;
let ground;


function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  let engine = Matter.Engine.create();
  let world = engine.world;

  // add blocks
  const group = Matter.Body.nextGroup(true);
  rect1 = new Block(world,
    { x: 400, y: 200, w: 400, h: 40, color: 'white' },
    {collisionFilter: {group: group}, angle: PI/10*4}
  );
  rect2 = new Block(world,
    { x: 400, y: 200, w: 400, h: 40, color: 'white' },
    {collisionFilter: {group: group}, angle: PI-PI/10*4}
  );

  // revolute
  rect2.constrainTo(rect1, { length: 0, stiffness: 1 });

  // rubberband
  rect1.constrainTo(rect2, {
    pointA: {x: 25, y: 80},
    pointB: {x: -25, y: 80},
    length: 70,
    stiffness: 0.5
  });

  // ground
  ground = new Block(world, {x:400, y: height, w: 810, h: 100, color: 'white'}, {isStatic: true});

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Engine.run(engine);
}

function draw() {
  background(0);
  ground.draw();
  rect1.draw();
  rect2.draw();
  rect1.drawConstraints();
  rect2.drawConstraints();
  mouse.draw();
}
