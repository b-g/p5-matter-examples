// Benedikt Groß

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

const drawBody = Helpers.drawBody;
const drawSprite = Helpers.drawSprite;
const drawMouse = Helpers.drawMouse;

let engine;

let box;
let boxImg;
let ball;
let ballImg;
let ramp;
let ground;


function setup() {
  const canvas = createCanvas(600, 385);

  // load images
  ballImg = loadImage('ball.png');
  boxImg = loadImage('box.png');

  // create an engine
  engine = Engine.create();

  // add bodies
  box = Bodies.rectangle(200, 0, 64, 64);
  ball = Bodies.circle(100, 50, 45);
  ramp = Bodies.rectangle(300, 200, 310, 30, {
    isStatic: true, angle: Math.PI * 0.08
  });
  ground = Bodies.rectangle(300, 355, 600, 60, { isStatic: true });
  World.add(engine.world, [box, ball, ramp, ground]);

  // setup mouse
  let mouse = Mouse.create(canvas.elt);
  let mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05, angularStiffness: 0 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);

  // run the engine
  Engine.run(engine);
}

function draw() {
  // use clear instead of background
  clear();

  drawSprite(ball, ballImg);
  drawSprite(box, boxImg);

  stroke('blue');
  strokeWeight(1);
  fill('orange');
  drawBody(ramp);
  noFill();
  drawBody(ground);

  drawMouse(mouseConstraint);
}
