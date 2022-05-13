Matter.use('matter-wrap');

let trampolineA;
let trampolineB;
let ball;
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

  // ball
  ball = new Ball(world,
    { x: 300, y: 50, r: 40, color: 'white' },
    { plugin: { wrap: wrap } }
  );

  // create two trampolines and a ground
  trampolineA = new Block(world,
    { x: 600, y: 500, w: 200, h: 50, color: 'white' },
    { isStatic: true, restitution: 0.5 }
  );
  trampolineB = new Block(world,
    { x: 200, y: 500, w: 200, h: 50, color: 'white' },
    { isStatic: true, restitution: 1 }
  );
  ground = new Block(world,
    { x: 400, y: height-25, w: 810, h: 25, color: 'grey' },
    { isStatic: true }
  );

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background('black');

  trampolineA.draw();
  trampolineB.draw();
  ball.draw();
  ground.draw();

  mouse.draw();
}
