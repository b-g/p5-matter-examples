Matter.use('matter-wrap');

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;

const drawBody = Helpers.drawBody;

let engine;
let trampolineA;
let trampolineB;
let ball;

let queueBall;


function setup() {
  const canvas = createCanvas(800, 600);

  // queueBall which records e.g. 25 old positions
  queueBall = new Queue(25);

  // ball
  ball = Bodies.circle(300, 50, 40);
  ball.plugin.wrap = {
      min: { x: 0, y: 0 },
      max: { x: width, y: height }
  };

  // create two trampolines
  trampolineA = Bodies.rectangle(600, 450, 250, 50, {
    isStatic: true, angle: Math.PI * -0.15
  });
  trampolineA.restitution = 0.7;
  trampolineB = Bodies.rectangle(200, 450, 250, 50, {
    isStatic: true, angle: Math.PI * 0.15
  });
  trampolineB.restitution = 0.7;

  // setup world and engine
  engine = Engine.create();
  World.add(engine.world, [trampolineA, trampolineB, ball]);
  Engine.run(engine);
}

function draw() {
  background(0);

  // draw queue
  noStroke();
  const points = queueBall.all();
  for (let i = 0; i < points.length; i++) {
    const fraction = 1 - i/points.length;
    const fillColor = lerpColor(color(255), color(50), fraction);
    fill(fillColor);
    const p = points[i];
    ellipse(p.x, p.y, 80, 80);
  }
  queueBall.add({x: ball.position.x, y: ball.position.y});

  // draw ball and trampolines
  noStroke();
  fill(200);
  drawBody(trampolineA);
  drawBody(trampolineB);
  drawBody(ball);
}


class Queue {
  constructor(maxLength) {
    this.maxLength = maxLength;
    this.elements = [];
  }
  add(element) {
    if (this.elements.length < this.maxLength) {
      this.elements.push(element);
    } else {
      this.elements.push(element);
      this.elements.shift();
    }
  }
  all() {
    return this.elements;
  }
}
