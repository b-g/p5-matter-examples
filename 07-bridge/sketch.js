// Benedikt Groß

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;
var Constraint = Matter.Constraint;
var Body = Matter.Body;
var Composites = Matter.Composites;
var Composite = Matter.Composite;

var engine;
var ground;
var bridge;
var ball;

var canvas;

function setup() {
  canvas = createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  // add bridge
  var group = Body.nextGroup(true);
  var rects = Composites.stack(100, 200, 10, 1, 10, 10, function(x, y) {
      return Bodies.rectangle(x, y, 50, 20, { collisionFilter: { group: group } });
  });
  bridge = Composites.chain(rects, 0.5, 0, -0.5, 0, {stiffness: 0.8, length: 2, render: {type: 'line'}});
  World.add(engine.world, [bridge]);

  // left and right fix point of bridge
  Composite.add(rects, Constraint.create({
    pointA: {x: 100, y: 200},
    bodyB: rects.bodies[0],
    pointB: {x: -25, y: 0},
    stiffness: 0.007
  }));
  Composite.add(rects, Constraint.create({
    pointA: {x: 700, y: 200},
    bodyB: rects.bodies[rects.bodies.length-1],
    pointB: {x: +25, y: 0},
    stiffness: 0.007
  }));

  // add ball
  ball = Bodies.circle(400, 0, 50);
  World.add(engine.world, [ball]);

  // ground
  ground = Bodies.rectangle(400, height, 810, 100, {isStatic: true});
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
  drawVertices(ball.vertices);
  drawBodies(bridge.bodies);
  stroke(128);
  strokeWeight(2);
  drawConstraints(bridge.constraints);

  noStroke();
  fill(128);
  drawVertices(ground.vertices);

  drawMouse(mouseConstraint);
}

function drawConstraints(constraints) {
  for (var i = 0; i < constraints.length; i++) {
    drawConstraint(constraints[i]);
  }
}

function drawBodies(bodies) {
  for (var i = 0; i < bodies.length; i++) {
    drawVertices(bodies[i].vertices);
  }
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
