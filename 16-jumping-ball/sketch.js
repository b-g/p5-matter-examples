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


function setup() {
  const canvas = createCanvas(800, 600);

  engine = Engine.create();

  circle = Bodies.circle(300, 50, 40, {
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
  drawBody(circle);

  fill(128);
  drawBody(slide);
  drawBody(obstacle);

  fill(255);
  textAlign(CENTER, CENTER);
  text('Press SPACE', width/2, 50);
}

function keyPressed() {
  // is SPACE pressed?
  if (keyCode === 32) {
    let direction = 1; // circle runs left to right ->
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
