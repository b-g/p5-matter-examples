// slap sound from
// http://soundbible.com/1948-Slap.html
// slap-soundmaster13-49669815.mp3

Matter.use('matter-wrap');

let hitSound;
let ball;
let propeller;
let angle = 0;


function preload() {
  // load sound
  hitSound = loadSound('./slap-soundmaster13-49669815.mp3');
  hitSound.playMode('sustain');
}

function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  const engine = Matter.Engine.create();
  const world = engine.world;

  // ball and propeller
  const wrap = {
    min: { x: 0, y: 0 },
    max: { x: width, y: height }
  };
  ball = new Ball(world,
    { x: 200, y: 50, r: 150, color: 'white' },
    { density: 0.0001, plugin: { wrap: wrap } }
  );
  propeller = new Block(world,
    { x: 400, y: 300, w: 650, h: 30, color: 'white' },
    { isStatic: true, angle: angle, label: 'propeller' }
  );

  // setup hit sound
  Matter.Events.on(engine, 'collisionStart', function(event) {
    const pairs = event.pairs[0];
    const bodyA = pairs.bodyA;
    const bodyB = pairs.bodyB;
    if (bodyA.label === "propeller" || bodyB.label === "propeller") {
      hitSound.play();
    }
  });

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background('black');

  // animate angle property of propeller
  Matter.Body.setAngle(propeller.body, angle);
  Matter.Body.setAngularVelocity(propeller.body, 0.15);
  angle += 0.07;

  // visualize collision
  const collided = Matter.Collision.collides(propeller.body, ball.body);
  if (collided) {
    propeller.attributes.color = 'red';
  } else {
    propeller.attributes.color = 'white';
  }

  propeller.draw();
  ball.draw();
  mouse.draw();
}
