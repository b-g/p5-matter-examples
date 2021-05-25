// Benedikt Groß

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

const drawMouse = Helpers.drawMouse;
const drawBody = Helpers.drawBody;
const drawBodies = Helpers.drawBodies;
const drawConstraints = Helpers.drawConstraints;

let engine;
let ground;
let bridge;
let ball;

let canvas;

function setup() {
  canvas = createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  // add bridge
  const group = Body.nextGroup(true);
  const rects = Composites.stack(100, 200, 10, 1, 10, 10, function(x, y) {
      return Bodies.rectangle(x, y, 50, 20, { collisionFilter: { group: group } });
  });
  bridge = Composites.chain(rects, 0.5, 0, -0.5, 0, {stiffness: 0.8, length: 2, render: {type: 'line'}});
  World.add(engine.world, [bridge]);

  // left and right fix point of bridge
  Composite.add(rects, Constraint.create({
    pointA: {x: 100, y: 200},
    bodyB: rects.bodies[0],
    pointB: {x: -25, y: 0},
    stiffness: 0.1
  }));
  Composite.add(rects, Constraint.create({
    pointA: {x: 700, y: 200},
    bodyB: rects.bodies[rects.bodies.length-1],
    pointB: {x: +25, y: 0},
    stiffness: 0.02
  }));

  // add ball
  ball = Bodies.circle(400, 0, 50);
  World.add(engine.world, [ball]);

  // ground
  ground = Bodies.rectangle(400, height, 810, 100, {isStatic: true});
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
  drawBody(ball);
  drawBodies(bridge.bodies);
  stroke(128);
  strokeWeight(2);
  drawConstraints(bridge.constraints);

  noStroke();
  fill(128);
  drawBody(ground);

  drawMouse(mouseConstraint);
}
