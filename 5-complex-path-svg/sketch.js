// Benno Stäbler, Benedikt Groß
// additional dependencies
// pathseg.js https://github.com/progers/pathseg
// decomp.js https://github.com/schteppe/poly-decomp.js/

Matter.use('matter-wrap');

let ball;
let polygon;
let ground;

function setup() {
  createCanvas(700, 600);

  // create an engine
  const engine = Matter.Engine.create();
  const world = engine.world;

  // use svg file to create the corresponding polygon
  polygon = new PolygonFromSVG(world,
    { x: 180, y: 300, fromFile: './path.svg', scale: 0.8, color: 'white' },
    { isStatic: true, friction: 0.0 }
  );

  // ball and ground
  const wrap = {
    min: { x: 0, y: 0 },
    max: { x: width, y: height }
  };
  ball = new Ball(world,
    { x: 100, y: 50, r: 40, color: 'white' },
    { friction: 0.0, plugin: { wrap: wrap } }
  );
  ground = new Block(world,
    { x: 550, y: 500, w: 500, h: 25, color: 'grey' },
    { isStatic: true, angle: PI * -0.1 }
  );

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background('black');

  ground.draw();
  polygon.draw();
  ball.draw();
  mouse.draw()
}
