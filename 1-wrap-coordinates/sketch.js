// Benedikt Groß

// setup wrap coordinates plugin
Matter.use('matter-wrap');

let ball;
let slide;


function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  const engine = Matter.Engine.create();
  const world = engine.world;

  // ball
  const wrap = {
      min: { x: 0, y: 0 },
      max: { x: width, y: height }
  };
  ball = new Ball(world,
    { x: 200, y: 50, r: 50, color: 'white' },
    { friction: 0.01, plugin: { wrap: wrap } }
  );

  // slide
  slide = new Block(world,
    { x: 400, y: 300, w: 700, h: 50, color: 'white' },
    { isStatic: true, angle: PI/10 }
  );

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Engine.run(engine);
}

function draw() {
  background(0);
  slide.draw();
  ball.draw();
  mouse.draw();
}
