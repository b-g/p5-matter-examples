let box;
let boxImg;
let ball;
let ballImg;
let ground;
let mouse;


function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  let engine = Matter.Engine.create();
  let world = engine.world;

  // load images
  ballImg = loadImage('ball.png');
  boxImg = loadImage('box.png');

  // add bodies
  box = new SpriteBlock(world, { x: 200, y: 200, w: 64, h: 64, image: boxImg});
  ball = new SpriteBall(world, { x: 100, y: 50, r: 45, image: ballImg});
  ground = new Block(world,
    { x: 400, y: 500, w: 810, h: 20, color: 'white'},
    { isStatic: true, angle: Math.PI * 0.06 }
  );

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Engine.run(engine);
}

function draw() {
  background(0);
  box.draw();
  ball.draw();
  ground.draw();
  mouse.draw();
}
