// Benedikt Groß

// setup wrap coordinates plugin
Matter.use('matter-wrap');

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Body = Matter.Body;
var Bodies = Matter.Bodies;

var canvas;

var engine;
var circle;
var obstacle;
var slide;


function setup() {
  canvas = createCanvas(800, 600);

  engine = Engine.create();

  circle = Bodies.circle(width/2, 50, 40, {
    restitution: 0
  });
  circle.plugin.wrap = {
    min: { x: 0, y: 0 },
    max: { x: width, y: height }
  };
  slide = Bodies.rectangle(400, 350, 800, 40, {
    isStatic: true,
    angle: Math.PI * 0.1
  });
  obstacle = Bodies.rectangle(400, 310, 40, 40, {
    isStatic: true,
    angle: Math.PI * 0.1
  });

  World.add(engine.world, [circle, slide, obstacle]);

  Engine.run(engine);
}

function draw() {
  background(0);

  noStroke();
  fill(255);
  drawVertices(circle.vertices);

  fill(128);
  drawVertices(slide.vertices);
  drawVertices(obstacle.vertices);

  fill(255);
  textAlign(CENTER, CENTER);
  text('Press SPACE', width/2, 50);
}

function keyPressed() {
  if (keyCode === 32) {
    var direction = 1; // circle runs left to right ->
    if ((circle.position.x - circle.positionPrev.x) < 0) {
      direction = -1; // circle runs right to left <-
    }
    // use current direction and velocity for the jump
    Body.applyForce(
      circle,
      {x: circle.position.x, y: circle.position.y},
      {x: (0.01 * direction) + circle.velocity.x/100, y: -0.1}
    );
  }
}


function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
