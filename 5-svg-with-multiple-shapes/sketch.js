// needs additional dependencies
// pathseg.js https://github.com/progers/pathseg
// decomp.js https://github.com/schteppe/poly-decomp.js/

let ground;
let importedShapes = [];

function setup() {
  const canvas = createCanvas(700, 600);

  // create an engine
  const engine = Matter.Engine.create();
  const world = engine.world;

  // add the shapes via the SVG file
  // (importedShapes stores the individual physics bodies)
  new BlocksFromSVG(world, "multiple_shapes.svg", importedShapes);
  console.log(importedShapes);

  // add the ground
  ground = new Block(world,
    { x: width / 2, y: 500, w: 600, h: 25, color: 'grey' },
    { isStatic: true }
  );

  // setup mouse
  mouse = new Mouse(engine, canvas, { stroke: 'white', strokeWeight: 2 });

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background('black');

  importedShapes.forEach((shape) => {
    shape.draw();
  });

  mouse.draw();
  ground.draw();
}
