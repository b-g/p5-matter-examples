// Benedikt Groß

// setup wrap coordinates plugin
Matter.use('matter-wrap');

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;
var Body = Matter.Body;

var engine;
var ball1;
var ball2;
var propeller;
var angle = 0;

var canvas;

function setup() {
  canvas = createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  // add bodies
  ball1 = Bodies.circle(400, 50, 25, {density: 0.01});
  ball2 = Bodies.circle(200, 50, 150, {density: 0.0001});
  var wrap = {
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
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
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
  drawVertices(ball1.vertices);
  drawVertices(ball2.vertices);
  drawVertices(propeller.vertices);
  drawMouse(mouseConstraint);
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
