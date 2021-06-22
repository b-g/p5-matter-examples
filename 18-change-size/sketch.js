// Benedikt Groß

// setup wrap coordinates plugin
Matter.use('matter-wrap');

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Body = Matter.Body;
const Bodies = Matter.Bodies;

const drawBody = Helpers.drawBody;

let engine;
let circle;
let obstacle;
let slide;

let isSmall = false;


function setup() {
  const canvas = createCanvas(800, 600);

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
  drawBody(circle);

  fill(128);
  drawBody(slide);
  drawBody(obstacle);

  fill(255);
  textAlign(CENTER, CENTER);
  text('Jump: SPACE, Scale: S', width/2, 50);
}

function keyPressed() {
  if (keyCode === 32) {
    if (isSmall) {
      Body.applyForce(
        circle,
        {x: circle.position.x, y: circle.position.y},
        {x: 0.03, y: -0.45}
      );
      console.log('big');
    } else {
      Body.applyForce(
        circle,
        {x: circle.position.x, y: circle.position.y},
        {x: 0.01, y: -0.1}
      );
    }
  }
  if (key === 's' || key === 'S') {
    if (isSmall) {
      Body.scale(circle, 0.5, 0.5);
    } else {
      Body.scale(circle, 2, 2);
    }
    isSmall = !isSmall; // toggle isSmall variable
  }
}
