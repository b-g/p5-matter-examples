// Benedikt Groß

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Constraint = Matter.Constraint;
const Composite = Matter.Composite;

const drawMouse = Helpers.drawMouse;
const drawBody = Helpers.drawBody;
const drawConstraint = Helpers.drawConstraint;

let engine;
let ground;

let rect1;
let rect2;
let revolute;
let gap;

let canvas;

function setup() {
  canvas = createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  // add bodies
  const group = Body.nextGroup(true);
  rect1 = Bodies.rectangle(400, 200, 400, 40, {collisionFilter: {group: group}, angle: PI/10*4});
  rect2 = Bodies.rectangle(400, 200, 400, 40, {collisionFilter: {group: group}, angle: PI-PI/10*4});
  revolute = Constraint.create({
    bodyA: rect1,
    pointA: {x: 0, y: 0},
    bodyB: rect2,
    pointB: {x: 0, y: 0},
    length: 0
  });
  gap = Constraint.create({
    bodyA: rect1,
    pointA: {x: 25, y: 80},
    bodyB: rect2,
    pointB: {x: -25, y: 80},
    length: 70,
    stiffness: 0.5
  });
  World.add(engine.world, [rect1, rect2, revolute, gap]);

  // ground
  ground = Bodies.rectangle(400, height, 810, 100, {isStatic: true});
  World.add(engine.world, [ground]);

  // setup mouse
  const mouse = Mouse.create(canvas.elt);
  const mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05, angularStiffness: 0.01 }
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
  fill(0);
  drawBody(ground);

  stroke(255);
  fill(255);
  drawBody(rect1);
  drawBody(rect2);

  stroke(128);
  strokeWeight(2);
  drawConstraint(revolute);
  drawConstraint(gap);

  drawMouse(mouseConstraint);
}
