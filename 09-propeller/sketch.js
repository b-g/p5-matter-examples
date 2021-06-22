// Benedikt Groß

// setup wrap coordinates plugin
Matter.use('matter-wrap');

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Body = Matter.Body;

const drawMouse = Helpers.drawMouse;
const drawBody = Helpers.drawBody;

let engine;
let ball1;
let ball2;
let propeller;
let angle = 0;


function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  // add bodies
  ball1 = Bodies.circle(400, 50, 25, {density: 0.01});
  ball2 = Bodies.circle(200, 50, 150, {density: 0.0001});
  const wrap = {
      min: {x: 0, y: 0},
      max: {x: width, y: height}
  };
  ball1.plugin.wrap = wrap;
  ball2.plugin.wrap = wrap;
  propeller = Bodies.rectangle(400, 300, 550, 25, {
    isStatic: true, angle: angle
  });
  World.add(engine.world, [ball1, ball2, propeller]);

  // setup mouse
  const mouse = Mouse.create(canvas.elt);
  const mouseParams = {
    mouse: mouse,
    constraint: {stiffness: 0.05}
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);

  // run the engine
  Engine.run(engine);
}

function draw() {
  background(0);

  // angle of propeller
  Body.setAngle(propeller, angle);
  Body.setAngularVelocity(propeller, 0.15);
  angle += 0.07;

  noStroke();
  fill(255);
  drawBody(ball1);
  drawBody(ball2);
  drawBody(propeller);
  drawMouse(mouseConstraint);
}
