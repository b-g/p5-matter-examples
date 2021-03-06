// Benedikt Groß

// http://soundbible.com/1948-Slap.html
// slap-soundmaster13-49669815.mp3

Matter.use('matter-wrap');
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

const drawBody = Helpers.drawBody;

let hitSound;

let engine;
let ball;
let propeller;
let angle = 0;


function setup() {
  const canvas = createCanvas(800, 600);

  engine = Engine.create();

  // bodies and world
  ball = Bodies.circle(200, 50, 150, { density: 0.0001 });
  const wrap = {
      min: {x: 0, y: 0},
      max: {x: width, y: height}
  };
  ball.plugin.wrap = wrap;

  propeller = Bodies.rectangle(400, 300, 650, 25, {
    isStatic: true, angle: angle, label: "propeller"
  });

  World.add(engine.world, [ball, propeller]);

  // load sound
  hitSound = loadSound("./slap-soundmaster13-49669815.mp3");
  hitSound.playMode('sustain');

  // setup hit sound
  Matter.Events.on(engine, 'collisionStart', function(event) {
    const pairs = event.pairs[0];
    const bodyA = pairs.bodyA;
    const bodyB = pairs.bodyB;
    if (bodyA.label === "propeller" || bodyB.label === "propeller") {
      hitSound.play();
    }
  });

  // run the engine
  Engine.run(engine);
}

function draw() {
  background(0);

  // angle of propeller
  Body.setAngle(propeller, angle);
  Body.setAngularVelocity(propeller, 0.15);
  angle += 0.07;

  noStroke();
  fill(255);
  drawBody(ball);

  // visualize collision
  const collided = Matter.SAT.collides(propeller, ball).collided;
  if (collided) {
    fill('red');
  } else {
    fill('white');
  }
  drawBody(propeller);
}
