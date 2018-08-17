// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;

var engine;
var box;
var boxImg;
var ball;
var ballImg;
var ground;

var canvas;

function setup() {
  canvas = createCanvas(800, 600);

  // load images
  ballImg = loadImage('ball.png');
  boxImg = loadImage('box.png');

  // create an engine
  engine = Engine.create();

  // add bodies
  box = Bodies.rectangle(200, 200, 64, 64);
  ball = Bodies.circle(100, 50, 45);
  ground = Bodies.rectangle(400, 500, 810, 10, {
    isStatic: true, angle: Math.PI * 0.06
  });
  World.add(engine.world, [box, ball, ground]);

  // run the engine
  Engine.run(engine);
}

function draw() {
  background(0);

  drawSprite(ball, ballImg);
  drawSprite(box, boxImg);

  fill(128);
  noStroke();
  drawVertices(ground.vertices);
}

function drawSprite(body, img) {
  var pos = body.position;
  var angle = body.angle;
  push();
  translate(pos.x, pos.y);
  rotate(angle);
  imageMode(CENTER);
  image(img, 0, 0);
  pop();
}

function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
