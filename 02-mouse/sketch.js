// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

const drawBody = Helpers.drawBody;
const drawMouse = Helpers.drawMouse;

let engine;
let boxA;
let boxB;
let ball;
let ground;


function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  // create two boxes and a ground
  boxA = Bodies.rectangle(200, 200, 80, 80);
  boxB = Bodies.rectangle(270, 50, 160, 80);
  ball = Bodies.circle(100, 50, 40);
  ground = Bodies.rectangle(400, 500, 810, 25, {
    isStatic: true, angle: Math.PI * 0.06
  });
  World.add(engine.world, [boxA, boxB, ball, ground]);

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
  background(0);

  noStroke();
  fill(255);
  drawBody(boxA);
  drawBody(boxB);
  drawBody(ball);

  fill(128);
  drawBody(ground);

  drawMouse(mouseConstraint);
}
