// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;
var Constraint = Matter.Constraint;

var engine;
var ground;

var constraint1;
var poly1;

var constraint2;
var poly2;

var constraint3;
var rect3;
var ball3;

var constraint4;
var polyA4;
var polyB4;

var canvas;

function setup() {
  canvas = createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  // add stiff global constraint
  poly1 = Bodies.polygon(300, 200, 5, 40);
  constraint1 = Constraint.create({
    pointA: { x: 150, y: 50 },
    bodyB: poly1,
    pointB: { x: -10, y: -20 }
  });
  World.add(engine.world, [poly1, constraint1]);

  // add damped soft global constraint
  poly2 = Bodies.polygon(400, 100, 4, 30);
  constraint2 = Constraint.create({
    pointA: { x: 400, y: 120 },
    bodyB: poly2,
    pointB: { x: -10, y: -10 },
    stiffness: 0.001,
    damping: 0.05
  });
  World.add(engine.world, [poly2, constraint2]);

  // add revolute constraint
  rect3 = Bodies.rectangle(600, 200, 200, 20);
  constraint3 = Constraint.create({
    pointA: { x: 600, y: 200 },
    bodyB: rect3,
    length: 0
  });
  // add a ball3 to play with the constraint
  ball3 = Bodies.circle(550, 150, 20);
  World.add(engine.world, [rect3, ball3, constraint3]);

  // add stiff multi-body constraint
  polyA4 = Bodies.polygon(100, 400, 6, 20);
  polyB4 = Bodies.polygon(200, 400, 1, 50);
  constraint4 = Constraint.create({
    bodyA: polyA4,
    pointA: { x: 0, y: 0 },
    bodyB: polyB4,
    pointB: { x: -10, y: -10 },
    stiffness: 0.01
  });
  World.add(engine.world, [polyA4, polyB4, constraint4]);

  // ground
  ground = Bodies.rectangle(400, height-10, 810, 10, {isStatic: true});
  World.add(engine.world, [ground]);

  // setup mouse
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
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
  drawVertices(poly1.vertices);
  drawVertices(poly2.vertices);
  drawVertices(rect3.vertices);
  drawVertices(ball3.vertices);
  drawVertices(polyA4.vertices);
  drawVertices(polyB4.vertices);
  stroke(128);
  strokeWeight(2);
  drawConstraint(constraint1);
  drawConstraint(constraint2);
  drawConstraint(constraint3);
  drawConstraint(constraint4);

  noStroke();
  fill(128);
  drawVertices(ground.vertices);

  drawMouse(mouseConstraint);
}

function drawConstraint(constraint) {
  var offsetA = constraint.pointA;
  var posA = {x:0, y:0};
  if (constraint.bodyA) {
    posA = constraint.bodyA.position;
  }
  var offsetB = constraint.pointB;
  var posB = {x:0, y:0};
  if (constraint.bodyB) {
    posB = constraint.bodyB.position;
  }
  line(
    posA.x + offsetA.x,
    posA.y + offsetA.y,
    posB.x + offsetB.x,
    posB.y + offsetB.y
  );
}

function drawMouse(mouseConstraint) {
  if (mouseConstraint.body) {
    var pos = mouseConstraint.body.position;
    var offset = mouseConstraint.constraint.pointB;
    var m = mouseConstraint.mouse.position;
    stroke(0, 255, 0);
    strokeWeight(2);
    line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
  }
}

function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
