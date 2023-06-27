let fishA;
let fishB;
let ground;

function setup() {
  createCanvas(800, 600);

  // create an engine
  let engine = Matter.Engine.create();
  let world = engine.world;

  // create fish and a ground
  fishA = new Fish(world, { x: 200, y: 200, type: 'catfish'});
  fishB = new Fish(world, { x: 270, y: 50, type: 'herring' });
  ground = new Block(world, { x: 400, y: 500, w: 810, h: 15, color: 'grey' }, { isStatic: true, angle: PI/36 });

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background('white');
  fishA.draw();
  fishB.draw();
  ground.draw();
}
