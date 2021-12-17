let box;
let boxImg;
let ball;
let ballImg;
let ramp;
let ground;


function setup() {
  const canvas = createCanvas(600, 385);

  // create an engine
  let engine = Matter.Engine.create();
  let world = engine.world;

  // load images
  ballImg = loadImage('ball.png');
  boxImg = loadImage('box.png');

  // add box, ball, ramp and ground
  box = new SpriteBlock(world, { x: 200, y: 0, w: 64, h: 64, image: boxImg});
  ball = new SpriteBall(world, { x: 100, y: 50, r: 45, image: ballImg});
  ramp = new Block(world,
    { x: 300, y: 200, w: 310, h: 30, color: 'pink'},
    { isStatic: true, angle: PI * 0.08 }
  );
  ground = new Block(world,
    { x: 300, y: 355, w: 600, h: 60, color: null},
    { isStatic: true }
  );

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  // use clear instead of background
  clear();

  ball.draw();
  box.draw();
  ramp.draw();
  ground.draw();
  mouse.draw();
}
