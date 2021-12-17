// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

let engine;
let balls;
let boxes;
let ground;
let mouse;


function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  let engine = Matter.Engine.create();
  let world = engine.world;

  // add stacks
  boxes = new Stack(world, {
    x: 200, y: 0, cols: 3, rows: 10, colGap: 3, rowGap: 3, color: 'white',
    create: (x, y) => Matter.Bodies.rectangle(x, y, 50, 50)
  });
  balls = new Stack(world, {
    x: 550, y: 0, cols: 3, rows: 10, colGap: 3, rowGap: 3, color: 'white',
    create: (x, y) => Matter.Bodies.circle(x, y, 25, { restitution: 1 })
  });

  // ground
  ground = new Block(world, { x: 400, y: height, w: 810, h: 50, color: 'white' }, {isStatic: true });

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background('black');
  boxes.draw();
  balls.draw();
  ground.draw();
  mouse.draw();
}
