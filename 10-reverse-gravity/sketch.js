// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;

let engine;

let box;
let ground;

function setup() {
  createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  // reverse gravity
  engine.world.gravity.y = -1;

  // add bodies
  box = Bodies.rectangle(600, 500, 80, 80);
  ground = Bodies.rectangle(400, 200, 810, 10, {
    isStatic: true, angle: Math.PI * 0.06
  });

  // add all of the bodies to the world
  World.add(engine.world, [box, ground]);

  // run the engine
  Engine.run(engine);
}

function draw() {
  background(0);

  fill(255);
  drawVertices(box.vertices);

  fill(128);
  drawVertices(ground.vertices);
}

function drawVertices(vertices) {
  beginShape();
  for (let i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
