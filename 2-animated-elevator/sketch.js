// Benedikt Groß

// setup wrap coordinates plugin
Matter.use('matter-wrap');

let ball1;
let ball2;
let elevator;


function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  const engine = Matter.Engine.create();
  const world = engine.world;

  // two balls
  const wrap = {
    min: { x: 0, y: 0 },
    max: { x: width, y: height }
  };
  ball1 = new Ball(world,
    { x: 400, y: 50, r: 25, color: 'white' },
    { frictionAir: 0.1, plugin: { wrap: wrap } }
  );
  ball2 = new Ball(world,
    { x: 200, y: 50, r: 150, color: 'white' },
    { frictionAir: 0.3, plugin: { wrap: wrap } }
  );

  // elevator
  elevator = new Block(world,
    { x: 400, y: 300, w: 550, h: 50, color: 'grey' },
    { isStatic: true }
  );

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background(0);

  // move the elevator up and down
  let swingY = height/2 + sin(frameCount * 0.2) * 100;
  Matter.Body.setPosition(
    elevator.body,
    {x: elevator.body.position.x, y: swingY}
  );

  ball1.draw();
  ball2.draw();
  elevator.draw();
  mouse.draw();
}
