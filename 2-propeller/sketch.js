// Benedikt Groß

// setup wrap coordinates plugin
Matter.use('matter-wrap');

let ball1;
let ball2;
let propeller;
let angle = 0;


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
    { density: 0.01, plugin: { wrap: wrap } }
  );
  ball2 = new Ball(world,
    { x: 200, y: 50, r: 150, color: 'white' },
    { density: 0.0001, plugin: { wrap: wrap } }
  );

  // propeller
  propeller = new Block(world,
    { x: 400, y: 300, w: 550, h: 30, color: 'white' },
    { isStatic: true, angle: angle }
  );

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background(0);

  // animate angle property of propeller
  Matter.Body.setAngle(propeller.body, angle);
  Matter.Body.setAngularVelocity(propeller.body, 0.15);
  angle += 0.07;

  propeller.draw();
  ball1.draw();
  ball2.draw();
  mouse.draw();
}
