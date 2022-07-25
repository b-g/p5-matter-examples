// needs additional dependencies
// pathseg.js https://github.com/progers/pathseg
// decomp.js https://github.com/schteppe/poly-decomp.js/

Matter.use('matter-wrap');

let ball;
let polygon;
let polygonImage;

function preload() {
  // Load the image
  polygonImage = loadImage('renderShape.svg');
  console.log(polygonImage);
}

function setup() {
  createCanvas(800, 700);

  // create an engine
  const engine = Matter.Engine.create();
  const world = engine.world;

  // use svg file to create the corresponding polygon
  polygon = new PolygonFromSVG(world,
    { x: 400, y: 400, fromFile: './collisionShape.svg', scale: 0.75, offset: {x: -12, y: -16}, image: polygonImage, color: 'white' },
    { isStatic: true, friction: 0.0 }
  );

  // ball
  const wrap = {
    min: { x: 0, y: 0 },
    max: { x: width, y: height }
  };
  ball = new Ball(world,
    { x: 580, y: 50, r: 40, color: 'white' },
    { friction: 0.0, plugin: { wrap: wrap } }
  );

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background('black');

  polygon.draw();
  ball.draw();
  mouse.draw()
}
