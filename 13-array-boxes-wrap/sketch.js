Matter.use('matter-wrap'); // setup wrap coordinates plugin

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;

var boxes = [];
var ground;

var canvas;

function setup() {
  canvas = createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  // create boxes
  for (var i = 0; i < 10; i++) {
    var newBox = Bodies.rectangle(random(100, 700), 200, random(10, 300), random(10, 300));
    newBox.plugin.wrap = {
      min: { x: 0, y: 0 },
      max: { x: width, y: height }
    };
    boxes.push(newBox);
  }
  World.add(engine.world, boxes);

  // static line
  ground = Bodies.rectangle(400, 500, 550, 10, {
    isStatic: true, angle: Math.PI * 0.06
  });
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

  noStroke();
  fill(255);
  for (var i = 0; i < boxes.length; i++) {
    drawVertices(boxes[i].vertices);
  }

  fill(128);
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
