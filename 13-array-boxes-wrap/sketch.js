Matter.use('matter-wrap'); // setup wrap coordinates plugin

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

const drawMouse = Helpers.drawMouse;
const drawBody = Helpers.drawBody;
const drawBodies = Helpers.drawBodies;

let engine;

let boxes = [];
let ground;

let canvas;

function setup() {
  canvas = createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  // create boxes
  for (let i = 0; i < 10; i++) {
    let newBox = Bodies.rectangle(random(100, 700), 200, random(10, 300), random(10, 300));
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
  const mouse = Mouse.create(canvas.elt);
  const mouseParams = {
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
  drawBodies(boxes)

  fill(128);
  drawBody(ground);

  drawMouse(mouseConstraint);
}
