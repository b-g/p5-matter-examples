let engine;
let balls;
let boxes;
let ground;
let mouse;
let edges = [];


function setup() {
  const canvas = createCanvas(640, 640);

  // create an engine
  engine = Matter.Engine.create();

  // reset gravity to zero for start, gravity will be controlled by motion
  engine.gravity.y = 0;

  let world = engine.world;

  // add stacks
  let stackWidth = 400;
  let stackGap = 10;
  boxes = new Stack(world, {
    x: 100, y: height / 2, cols: 3, rows: 3, colGap: stackGap, rowGap: stackGap, color: 'white',
    create: (x, y) => Matter.Bodies.rectangle(x, y, 50, 50, { restitution: 0.2, density: 1, })
  });
  balls = new Stack(world, {
    x: 400, y: height / 2, cols: 3, rows: 3, colGap: stackGap, rowGap: stackGap, color: 'grey',
    create: (x, y) => Matter.Bodies.circle(x, y, 25, { restitution: 0.4 })
  });

  // static edges on all sides
  let widthEdge = 20;
  // top
  edges.push(new Block(world, { x: width / 2, y: 0, w: width, h: widthEdge }, { isStatic: true }));
  // bottom
  edges.push(new Block(world, { x: width / 2, y: height, w: width, h: widthEdge }, { isStatic: true }));
  // left
  edges.push(new Block(world, { x: 0, y: height / 2, w: widthEdge, h: height }, { isStatic: true }));
  // right
  edges.push(new Block(world, { x: width, y: height / 2, w: widthEdge, h: height }, { isStatic: true }));

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background('black');

  // apply rotation of device to gravity
  engine.gravity.x = (rotationY / 2 - engine.gravity.x) * 0.5;
  engine.gravity.y = (rotationX / 2 - engine.gravity.y) * 0.5;

  boxes.draw();
  balls.draw();
  mouse.draw();
}
