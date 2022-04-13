let box;
let ceiling;
let obstacle;
let ground;

let engine;


function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  engine = Matter.Engine.create();
  let world = engine.world;

  // reverse gravity
  engine.world.gravity.y *= -1;

  // add block and ground
  box = new Block(world, { x: 600, y: 500, w: 50, h: 50, color: 'white' });
  obstacle = new Block(world,
    { x: 400, y: 200, w: 500, h: 50, color: 'white' },
    { isStatic: true, angle: PI/10 }
  );
  ceiling = new Block(world, { x: 400, y: 0, w: 1000, h: 30, color: 'grey' }, { isStatic: true });
  ground = new Block(world, { x: 400, y: height, w: 1000, h: 30, color: 'grey' }, { isStatic: true });

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background(0);
  ceiling.draw();
  ground.draw();
  obstacle.draw();
  box.draw();
  mouse.draw();
}

function keyPressed(event) {
  // is SPACE pressed?
  if (event.keyCode === 32) {
    // reverse gravity
    engine.world.gravity.y *= -1;
    // prevent SPACE bar from scrolling page
    event.preventDefault();
  }
}
