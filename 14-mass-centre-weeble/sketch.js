// Benedikt Groß
// Example shows how to offset the centre of the mass to create a "Weeble"

Matter.use('matter-wrap');

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;
var circle;
var ground;
var spriteImg;

var canvas;


function setup() {
  canvas = createCanvas(800, 600);

  // load image
  spriteImg = loadImage('1F51D.png');

  // create an engine
  engine = Engine.create();

  // bouncy circle with custom centre of mass
  circle = Bodies.circle(350, 50, 100, {
    restitution: 0.5, // bouncy
    frictionAir: 0.001
  });
  circle.plugin.wrap = {
    min: { x: 0, y: 0 },
    max: { x: width, y: height }
  };
  setMassCentre(circle, {x: 0, y: 50});
  World.add(engine.world, [circle]);

  // ground
  ground = Bodies.rectangle(400, height, 1000, 50, {
    isStatic: true
  });
  World.add(engine.world, [ground]);

  // setup mouse
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05, angularStiffness: 0 }
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
  drawSprite(circle, spriteImg, -70, 200, 200);
  drawMassCenter(circle);

  fill(128);
  drawVertices(ground.vertices);

  drawMouse(mouseConstraint);
}

function setMassCentre(body, offset) {
  body.position.x += offset.x;
  body.position.y += offset.y;
  body.positionPrev.x += offset.x;
  body.positionPrev.y += offset.y;
}

function drawMassCenter(body) {
  fill('red');
  ellipse(body.position.x, body.position.y, 5, 5);
}

function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}

function drawSprite(body, img, offsetY, w, h) {
  var pos = body.position;
  push();
  translate(pos.x, pos.y);
  rotate(body.angle);
  imageMode(CENTER);
  image(img, 0, offsetY, w, h);
  pop();
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
