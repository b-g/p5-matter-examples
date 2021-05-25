// Benedikt Groß

// setup wrap coordinates plugin
Matter.use('matter-wrap');

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Body = Matter.Body;

const drawMouse = Helpers.drawMouse;
const drawBody = Helpers.drawBody;
const drawText = Helpers.drawText;

let engine;
let balls = [];
let rects = [];
let propellers = [];

let canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();

  // balls
  for (let i = 0; i < 18; i++) {
    let ball = Bodies.circle(random(width), -500, 25, {
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
  const mouse = Mouse.create(canvas.elt);
  const mouseParams = {
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
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    fill(255);
    drawBody(ball);
    fill(0);
    drawText(ball, i);
  }

  fill(255);
  for (const rect of rects) {
    drawBody(rect);
  }

  for (let i = 0; i < propellers.length; i++) {
    let propeller = propellers[i];
    // angle of propeller
    Body.setAngle(propeller, propeller.angle + 0.50 * (i+1)/10);
    Body.setAngularVelocity(propeller, 0.10);
    drawBody(propeller);
  }

  drawMouse(mouseConstraint);
}
