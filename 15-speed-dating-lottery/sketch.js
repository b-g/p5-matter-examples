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
var balls = [];
var rects = [];
var propellers = [];

var canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();

  // balls
  for (var i = 0; i < 18; i++) {
    var ball = Bodies.circle(random(width), -500, 25, {
      restitution: 0.5,
      density: 0.9
    })
    ball.plugin.wrap = {
      min: {x: 0, y: 0},
      max: {x: width, y: height}
    };
    balls.push(ball);
  }
  World.add(engine.world, balls);

  // rects
  rects.push( Bodies.rectangle(width/2, 765, 130, 10, {isStatic: true}) );
  rects.push( Bodies.rectangle(width/2 - 100, 160, 100, 10, {isStatic: true, angle: PI/4}) );
  rects.push( Bodies.rectangle(width/2 + 100, 160, 100, 10, {isStatic: true, angle: -PI/4}) );

  rects.push( Bodies.rectangle(width/2, 500, 5, 400, {isStatic: true}) );
  rects.push( Bodies.rectangle(width/2 - 60, 500, 10, 500, {isStatic: true}) );
  rects.push( Bodies.rectangle(width/2 + 60, 500, 10, 500, {isStatic: true}) );
  World.add(engine.world, rects);

  // propellers
  propellers.push( Bodies.rectangle(width/2 - 350, 150, 400, 25, {isStatic: true, angle: random(PI)}) );
  propellers.push( Bodies.rectangle(width/2 + 350, 150, 400, 25, {isStatic: true, angle: random(PI)}) );
  propellers.push( Bodies.rectangle(width/2, 50, 125, 25, {isStatic: true, angle: random(PI)}) );
  World.add(engine.world, propellers);

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

  textSize(20);
  textStyle(BOLD);
  noStroke();
  for (var i = 0; i < balls.length; i++) {
    var ball = balls[i];
    fill(255);
    drawVertices(ball.vertices);
    fill(0);
    drawText(ball, i);
  }

  fill(255);
  for (var i = 0; i < rects.length; i++) {
    drawVertices(rects[i].vertices);
  }

  for (var i = 0; i < propellers.length; i++) {
    // angle of propeller
    Body.setAngle(propellers[i], propellers[i].angle + 0.50 * (i+1)/10);
    Body.setAngularVelocity(propellers[i], 0.10);
    drawVertices(propellers[i].vertices);
  }

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

function drawText(body, txt) {
  var pos = body.position;
  var angle = body.angle;
  push();
  translate(pos.x, pos.y);
  rotate(angle);
  textAlign(CENTER, CENTER);
  text(txt, 0, 0);
  pop();
}

function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
