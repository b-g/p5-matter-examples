// Benedikt Groß

// setup wrap coordinates plugin
Matter.use('matter-wrap');

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;
var circle;
var slide;
var ground;

var canvas;

function setup() {
  canvas = createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  circle = Bodies.circle(200, 50, 40);
  circle.plugin.wrap = {
      min: { x: 0, y: 0 },
      max: { x: width, y: height }
  };
  slide = Bodies.rectangle(400, 300, 500, 20, {
    isStatic: true, angle: Math.PI * 0.06
  });
  ground = Bodies.rectangle(400, 550, 810, 10, {isStatic: true});
  World.add(engine.world, [circle, slide, ground]);

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

  noStroke();
  fill(255);
  drawVertices(circle.vertices);

  fill(128);
  drawVertices(slide.vertices);
  drawVertices(ground.vertices);

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
