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

var isSmall = false;


function setup() {
  canvas = createCanvas(800, 600);

  engine = Engine.create();

  circle = Bodies.circle(200, 50, 40, {
    restitution: 0
  });
  circle.plugin.wrap = {
    min: { x: 0, y: 0 },
    max: { x: width, y: height }
  };
  slide = Bodies.rectangle(400, 350, 700, 40, {
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
  text('Jump: SPACE, Scale: S', width/2, 50);
}

function keyPressed() {
  if (keyCode === 32) {
    Body.applyForce(
      circle,
      {x: circle.position.x, y: circle.position.y},
      {x: 0.01, y: -0.1}
    );
  }
  if (key === 's' || key === 'S') {
    if (isSmall) {
      Body.scale(circle, 0.5, 0.5);
    } else {
      Body.scale(circle, 2, 2);
    }
    console.log(isSmall);
    isSmall = !isSmall; // toggle isSmall variable
  }
}


function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
