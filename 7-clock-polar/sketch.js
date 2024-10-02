Matter.use('matter-wrap');

let handSec;
let handMin;
let handHour;
let boxes = [];
let mouse;
let center;

function setup() {
  const canvas = createCanvas(600, 600);
  center = { x: width / 2, y: height / 2 };

  // create an engine
  let engine = Matter.Engine.create();
  let world = engine.world;

  // config wrap area
  const wrap = {
    min: { x: 0, y: 0 },
    max: { x: width, y: height }
  };

  // create boxes
  for (let i = 0; i < 10; i++) {
    let newBox = new Block(world,
      { x: random(100, 600), y: 200, w: random(10, 250), h: random(10, 250), color: 'grey' },
      { frictionAir: 0.01, plugin: { wrap: wrap } }
    );
    boxes.push(newBox);
  }

  // handles of the clock
  handSec = new Block(world, { w: 5, h: 300, x: center.x, y: center.y - 150, color: 'white' }, { isStatic: true });
  handMin = new Block(world, { w: 10, h: 250, x: center.x, y: center.y - 125, color: 'white' }, { isStatic: true });
  handHour = new Block(world, { w: 15, h: 200, x: center.x, y: center.y - 100, color: 'white' }, { isStatic: true });

  // add a mouse to manipulate Matter objects
  mouse = new Mouse(engine, canvas, { stroke: 'magenta', strokeWeight: 2 });

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background('black');

  const angleSec = map(second(), 0, 60, 0, TWO_PI);
  const angleMin = map(minute(), 0, 60, 0, TWO_PI);
  const angleHour = map(hour(), 0, 12, 0, TWO_PI);

  handSec.rotate(angleSec, { x: center.x, y: center.y });
  handMin.rotate(angleMin, { x: center.x, y: center.y });
  handHour.rotate(angleHour, { x: center.x, y: center.y });

  handSec.draw();
  handMin.draw();
  handHour.draw();

  for (let box of boxes) {
    box.draw();
  }

  mouse.draw();
}
