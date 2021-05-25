// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Composites = Matter.Composites;

const drawMouse = Helpers.drawMouse;
const drawBody = Helpers.drawBody;
const drawBodies = Helpers.drawBodies;

let engine;
let ground;
let balls;
let boxes;

let canvas;

function setup() {
  canvas = createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  // add boxes
  // xx, yy, columns, rows, columnGap, rowGap
  boxes = Composites.stack(200, 0, 3, 10, 3, 3, function(x, y) {
    return Bodies.rectangle(x, y, 50, 50);
  });
  // add balls
  balls = Composites.stack(500, 0, 2, 5, 3, 3, function(x, y) {
    return Bodies.circle(x, y, 50);
  });
  World.add(engine.world, [boxes, balls]);

  // ground
  ground = Bodies.rectangle(400, height-10, 810, 30, {isStatic: true});
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

  stroke(128);
  strokeWeight(1);
  fill(255);
  drawBodies(boxes.bodies);
  drawBodies(balls.bodies);

  noStroke();
  fill(128);
  drawBody(ground);

  drawMouse(mouseConstraint);
}
