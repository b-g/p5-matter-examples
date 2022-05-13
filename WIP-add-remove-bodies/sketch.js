const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

const drawBody = Helpers.drawBody;
const drawMouse = Helpers.drawMouse;

let engine;
let groundLeft;
let groundRight;
let balls = [];


function setup() {
  const canvas = createCanvas(800, 600);

  engine = Engine.create();

  // setup ground
  groundLeft = Bodies.rectangle(200, 450, 460, 30, {
    isStatic: true, angle: Math.PI * 0.15
  });
  groundRight = Bodies.rectangle(600, 450, 460, 30, {
    isStatic: true, angle: Math.PI * -0.15
  });
  World.add(engine.world, [groundLeft, groundRight]);

  // setup mouse
  let mouse = Mouse.create(canvas.elt);
  let mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05, angularStiffness: 0 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);

  // run simulation
  Engine.run(engine);
}

function draw() {
  background(0);

  fill(255);
  textAlign(CENTER, CENTER);
  text('Click: New Body\nDouble Click: Remove Body', width/2, 50);

  noStroke();
  fill(255);
  for (const ball of balls) {
    drawBody(ball);
  }

  fill(128);
  drawBody(groundLeft);
  drawBody(groundRight);
}

function addBody() {
  const newBall = Bodies.circle(mouseX, mouseY, random(5, 100));
  balls.push(newBall);
  World.add(engine.world, newBall);
}

function removeBody() {
  if (mouseConstraint.body) {
    const lastClickedBody = mouseConstraint.body;
    World.remove(engine.world, lastClickedBody);
    balls = balls.filter(ball => ball !== lastClickedBody);
  }
}

function mouseReleased(event) {
  // single click
  if (event.detail === 1) {
    addBody();
  }
  // double click
  if (event.detail === 2) {
    removeBody();
  }
}
