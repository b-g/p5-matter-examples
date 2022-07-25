let pentagon;
let polygon;
let ground;
let mouse;

function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  let engine = Matter.Engine.create();
  let world = engine.world;

  // create polygons and a ground
  ground = new Block(
    world,
    { x: 400, y: 500, w: 810, h: 15, color: 'grey' },
    { isStatic: true, angle: PI/36 }
    );
  pentagon = new Polygon(world, { x: 400, y: 100, s: 5, r: 50, color: 'white' });

  const points = [
    { x: 0, y: 0 },
    { x: 100, y: 10 },
    { x: 150, y: 100 },
    { x: 150, y: 150 },
    { x: 0, y: 50 + random(0, 400) }
  ];
  polygon = new PolygonFromPoints(world,
    { x: 300, y: 0, points: points, color: 'white' }
  );

  // add a mouse to manipulate Matter objects
  mouse = new Mouse(engine, canvas, { stroke: 'magenta', strokeWeight: 2 });

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background('black');
  ground.draw();
  pentagon.draw();
  polygon.draw();
  mouse.draw();
}
