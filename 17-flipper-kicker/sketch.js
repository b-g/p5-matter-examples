// Benedikt Groß

// setup wrap coordinates plugin
Matter.use('matter-wrap');

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Body = Matter.Body;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

let canvas;

let engine;
let circle;
let slideLeft;
let slideRight;
let kicker;
let kickerConstraint;
let ground;


function setup() {
  canvas = createCanvas(800, 600);

  engine = Engine.create();

  circle = Bodies.circle(200, 50, 40);
  circle.plugin.wrap = {
    min: { x: 0, y: 0 },
    max: { x: width, y: height }
  };
  slideLeft = Bodies.rectangle(100, 350, 400, 40, {
    isStatic: true,
    angle: Math.PI * 0.2
  });
  slideRight = Bodies.rectangle(700, 350, 400, 40, {
    isStatic: true,
    angle: Math.PI * -0.2
  });
  ground = Bodies.rectangle(450, 590, 900, 40, {
    isStatic: true
  });

  // add revolute constraint for kicker
  kicker = Bodies.rectangle(300, 550, 300, 40);
  setMassCentre(kicker, {x: -100, y: 0});
  kickerConstraint = Constraint.create({
    pointA: {x: 300, y: 550},
    bodyB: kicker,
    stiffness: 0.5,
    length: 0
  });

  World.add(engine.world, [circle, slideLeft, slideRight, kicker, kickerConstraint, ground]);

  Engine.run(engine);
}

function draw() {
  background(0);

  noStroke();
  fill(255);
  drawVertices(circle.vertices);

  fill(128);
  drawVertices(slideLeft.vertices);
  drawVertices(slideRight.vertices);
  drawVertices(ground.vertices);
  fill(200);
  drawVertices(kicker.vertices);

  stroke('magenta');
  strokeWeight(3);
  drawConstraint(kickerConstraint);

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  text('Press SPACE', width/2, 50);
}

function keyPressed() {
  if (keyCode === 32) {
    Body.applyForce(
      kicker,
      {x: kicker.position.x + 200, y: kicker.position.y},
      {x: 0, y: -0.5}
    );
  }
}

function drawConstraint(constraint) {
  const offsetA = constraint.pointA;
  let posA = {x:0, y:0};
  if (constraint.bodyA) {
    posA = constraint.bodyA.position;
  }
  const offsetB = constraint.pointB;
  let posB = {x:0, y:0};
  if (constraint.bodyB) {
    posB = constraint.bodyB.position;
  }
  line(
    posA.x + offsetA.x,
    posA.y + offsetA.y,
    posB.x + offsetB.x,
    posB.y + offsetB.y
  );
  point(
    posA.x + offsetA.x,
    posA.y + offsetA.y
  );
  point(
    posB.x + offsetB.x,
    posB.y + offsetB.y
  );
}

function setMassCentre(body, offset) {
  body.position.x += offset.x;
  body.position.y += offset.y;
  body.positionPrev.x += offset.x;
  body.positionPrev.y += offset.y;
}

function drawVertices(vertices) {
  beginShape();
  for (let i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
