Matter.use('matter-wrap');

let ball;
let slide;


function setup() {
  const canvas = createCanvas(128, 72);
  canvas.style('width', '100%');
  canvas.style('height', '100%');

  // create an engine
  const engine = Matter.Engine.create();
  const world = engine.world;

  // ball
  const wrap = {
      min: { x: 0, y: 0 },
      max: { x: width, y: height }
  };
  ball = new Ball(world,
    { x: 20, y: 5, r: 10, color: 'white' },
    { friction: 0.1, plugin: { wrap: wrap } }
  );

  // slide
  slide = new Block(world,
    { x: 64, y: 36, w: 135, h: 5, color: 'white' },
    { isStatic: true, angle: PI/10 }
  );

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background(0);
  slide.draw();
  ball.draw();
  mouse.draw();
}
