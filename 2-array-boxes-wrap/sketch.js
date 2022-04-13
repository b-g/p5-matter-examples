Matter.use('matter-wrap'); // setup wrap coordinates plugin

let boxes = [];
let ground;


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

  // create boxes
  for (let i = 0; i < 10; i++) {
    let newBox = new Block(world,
      { x: random(100, 700), y: 200, w: random(10, 300), h: random(10, 300), color: 'white' },
      { plugin: { wrap: wrap } }
    );
    boxes.push(newBox);
  }

  // static line
  ground = new Block(world,
    { x: 400, y: 500, w: 550, h: 20, color: 'grey' },
    { isStatic: true, angle: PI * 0.06 }
  );

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background(0);

  ground.draw();
  for (let box of boxes) {
    box.draw();
  }
  mouse.draw();
}
