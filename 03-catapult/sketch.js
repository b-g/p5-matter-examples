// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Constraint = Matter.Constraint;

const drawBody = Helpers.drawBody;
const drawMouse = Helpers.drawMouse;
const drawConstraint = Helpers.drawConstraint;

let engine;
let ground;

let ball1;
let ball2;

let catapult;
let catapultSpacer;
let constraint;

let canvas;

function setup() {
  canvas = createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  // add revolute constraint for catapult
  catapult = Bodies.rectangle(400, 520, 600, 20);
  constraint = Constraint.create({
    pointA: {x: 400, y: 520},
    bodyB: catapult,
    stiffness: 1,
    length: 0
  });
  World.add(engine.world, [catapult, constraint]);

  // balls and catapult spacer for limit
  catapultSpacer = Bodies.rectangle(150, 555, 20, 50, {isStatic: true });
  ball1 = Bodies.circle(560, 100, 50, {density: 0.01}); // make big one more 'heavy'
  ball2 = Bodies.circle(110, 480, 20);
  World.add(engine.world, [catapultSpacer, ball1, ball2]);

  // ground
  ground = Bodies.rectangle(400, height-10, 810, 25, {isStatic: true});
  World.add(engine.world, [ground]);

  // setup mouse
  const mouse = Mouse.create(canvas.elt);
  const mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);

  // run the engine
  Engine.run(engine);
}

function draw() {
  background(0);

  stroke(255);
  fill(255);
  drawBody(catapult);
  drawBody(catapultSpacer);
  drawBody(ball1);
  drawBody(ball2);
  stroke(128);
  strokeWeight(2);
  drawConstraint(constraint);

  noStroke();
  fill(128);
  drawBody(ground);

  drawMouse(mouseConstraint);
}
