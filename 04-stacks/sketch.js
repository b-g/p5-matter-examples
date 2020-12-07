// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Composites = Matter.Composites;

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
  ground = Bodies.rectangle(400, height-10, 810, 10, {isStatic: true});
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
  drawVertices(ground.vertices);

  drawMouse(mouseConstraint);
}

function drawBodies(bodies) {
  for (let i = 0; i < bodies.length; i++) {
    drawVertices(bodies[i].vertices);
  }
}

function drawMouse(mouseConstraint) {
  if (mouseConstraint.body) {
    const pos = mouseConstraint.body.position;
    const offset = mouseConstraint.constraint.pointB;
    const m = mouseConstraint.mouse.position;
    stroke(0, 255, 0);
    strokeWeight(2);
    line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
  }
}

function drawVertices(vertices) {
  beginShape();
  for (let i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
