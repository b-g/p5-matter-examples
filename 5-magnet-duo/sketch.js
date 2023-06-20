let magnetA;
let magnetB;
let boxes;


function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);

  // create an engine
  let engine = Matter.Engine.create();
  let world = engine.world;

  // no gravity
  engine.world.gravity.scale = 0;

  // add a group of identical boxes
  boxes = new Stack(
    world,
    {
      x: width / 2 - 150, y: 0, cols: 10, rows: 10, colGap: 5, rowGap: 5, color: 'black',
      create: (x, y) => Matter.Bodies.rectangle(x, y, 25, 10, { restitution: 0.9 })
    }
  );

  // add magnets
  // NOTE: Adding a "mass" is important, otherwise mass will default to infinite which makes for weird behaviour
  magnetA = new Magnet(
    world,
    { x: width/2 - 200, y: height/2, r: 75, color: 'grey', attraction: 0.4 },
    { isStatic: true, mass: 50 }
  );
  magnetA.addAttracted(boxes.body.bodies);
  magnetB = new Magnet(
    world,
    { x: width / 2 + 200, y: height/2, r: 75, color: 'grey', attraction: 0.4 },
    { isStatic: true, mass: 50 }
  );
  magnetB.addAttracted(boxes.body.bodies);

  // add a mouse to manipulate Matter objects
  mouse = new Mouse(engine, canvas, { stroke: 'magenta', strokeWeight: 2 });

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background(255, 10);

  magnetA.gravity();
  magnetB.gravity();
  magnetA.draw();
  magnetB.draw();
  boxes.draw();
  mouse.draw();
}
