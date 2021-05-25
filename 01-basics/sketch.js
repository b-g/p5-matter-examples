const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;

const drawBody = Helpers.drawBody;

let engine;

let boxA;
let boxB;
let ground;

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
  drawBody(boxA);
  drawBody(boxB);

  fill(128);
  drawBody(ground);
}
