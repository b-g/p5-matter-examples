// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;

var engine;

var boxA;
var boxB;
var ground;

function setup() {
  createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  // create two boxes and a ground
  boxA = Bodies.rectangle(200, 200, 80, 80);
  boxB = Bodies.rectangle(270, 50, 160, 80);
  ground = Bodies.rectangle(400, 500, 810, 10, {
    isStatic: true, angle: Math.PI * 0.06
  });

  // add all of the bodies to the world
  World.add(engine.world, [boxA, boxB, ground]);

  // run the engine
  Engine.run(engine);
}

function draw() {
  background(0);

  fill(255);
  drawVertices(boxA.vertices);
  drawVertices(boxB.vertices);

  fill(128);
  drawVertices(ground.vertices);
}

function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
