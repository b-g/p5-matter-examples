// needs additional dependencies
// pathseg.js https://github.com/progers/pathseg
// decomp.js https://github.com/schteppe/poly-decomp.js/

Matter.use('matter-wrap');

let polygon;
let ground;

function setup() {
  const canvas = createCanvas(700, 600);
  const engine = Matter.Engine.create();
  const world = engine.world;
  const wrap = {
    min: { x: 0, y: 0 },
    max: { x: width, y: height }
  };

  // add polygon and ground
  polygon = new PolygonFromSVG(world,
    { x: 180, y: 0, fromFile: './arrow.svg', scale: 0.8, color: 'white' },
    { plugin: { wrap: wrap } }
  );
  ground = new Block(world,
    { x: width/2, y: height - 25, w: 750, h: 25, color: 'grey' },
    { isStatic: true, plugin: { wrap: wrap } }
  );

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Runner.run(engine);

  // rotate the polygon
  Matter.Body.setAngle(polygon.body, random(0, 360));
}

function draw() {
  background('black');
  ground.draw();
  polygon.draw();
  mouse.draw();

  fill(255);
  textAlign(CENTER, CENTER);
  text('Press R to rotate shape', width / 2, 50);
}

function keyPressed() {
  if (key === 'R' || key === 'r') {
      Matter.Body.setAngle(polygon.body, random(0, 360));
  }
}
