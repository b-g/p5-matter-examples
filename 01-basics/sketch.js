let engine;

let blockA;
let blockB;
let ground;

function setup() {
  createCanvas(800, 600);

  // create an engine
  engine = Matter.Engine.create();

  // create two boxes and a ground
  blockA = new Block({ x: 200, y: 200, w: 80, h: 80, color: 'white' }, { isStatic: false });
  blockB = new Block({ x: 270, y: 50, w: 160, h: 80, color: 'white' }, { isStatic: false });
  ground = new Block({ x: 400, y: 500, w: 810, h: 15, color: 'grey' }, {
    isStatic: true, angle: Math.PI * 0.06
  });

  // run the engine
  Matter.Engine.run(engine);
}

function draw() {
  background(0);
  blockA.draw();
  blockB.draw();
  ground.draw();
}
