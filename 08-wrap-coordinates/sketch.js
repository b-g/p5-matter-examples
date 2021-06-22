// Benedikt Groß

// setup wrap coordinates plugin
Matter.use('matter-wrap');

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

const drawMouse = Helpers.drawMouse;
const drawBody = Helpers.drawBody;

let engine;
let circle;
let slide;
let ground;


function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  circle = Bodies.circle(200, 50, 40);
  circle.plugin.wrap = {
      min: { x: 0, y: 0 },
      max: { x: width, y: height }
  };
  slide = Bodies.rectangle(400, 300, 500, 30, {
    isStatic: true, angle: Math.PI * 0.06
  });
  ground = Bodies.rectangle(400, 550, 750, 30, {isStatic: true});
  World.add(engine.world, [circle, slide, ground]);

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
  drawBody(circle);

  fill(128);
  drawBody(slide);
  drawBody(ground);

  drawMouse(mouseConstraint);
}
