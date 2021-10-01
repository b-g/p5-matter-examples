// Benedikt Groß

let ground;
let bridge;
let ball;
let blocks;

function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  const engine = Matter.Engine.create();
  let world = engine.world;

  // create a few chain links
  blocks = [];
  const group = Matter.Body.nextGroup(true);
  for (let i = 0; i < 10; i++) {
    blocks.push(
      new Block(world, { x: 125 + i*60, y: 210, w: 50, h: 30, color: 'white' }, { collisionFilter: { group: group } })
    );
  }
  // add bridge
  bridge = new Chain(
    world,
    { blocks: blocks, xOffsetA: 0.5, yOffsetA: 0, xOffsetB: -0.5, yOffsetB: 0, color: 'red' },
    { stiffness: 0.1, length: 2, draw: true }
  );

  // left and right fix point of bridge

  const fixedPointLeft = blocks[0].constrainTo(null, {
    pointA: { x: 0, y: -200 },
    stiffness: 0.02,
    draw: true
  });
  bridge.addConstraint(fixedPointLeft);

  const fixedPointRight = blocks[blocks.length-1].constrainTo(null, {
    pointA: { x: 0, y: -200 },
    stiffness: 0.02,
    draw: true
  });
  bridge.addConstraint(fixedPointRight);

  // add ball
  ball = new Ball(world, { x: 400, y: 0, r: 50, color: 'white' });

  // ground
  ground = new Block(world, { x:400, y: height, w: 810, h: 100, color: 'white' }, { isStatic: true });

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  //Matter.Engine.run(engine);
}

function draw() {
  background(0);
  ground.draw();
  bridge.draw();
  bridge.drawConstraints();
  ball.draw();
  mouse.draw();
}
