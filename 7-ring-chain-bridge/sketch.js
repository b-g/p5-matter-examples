let ground;
let bridge;
let ball;
let blocks = [];

function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  const engine = Matter.Engine.create();
  let world = engine.world;

  blocks.push(new Block(world, { x: width / 2, y: height - 20, w: width, h: 40, color: 'black' }, { isStatic: true }));   
  
  // 3 fixed balls to hang the ring
  blocks.push(new Ball(world, { x: 200, y: 150, r: 20, color: 'black' }, { isStatic: true }));   
  blocks.push(new Ball(world, { x: 300, y: 250, r: 20, color: 'black' }, { isStatic: true }));   
  blocks.push(new Ball(world, { x: 120, y: 250, r: 20, color: 'black' }, { isStatic: true }));   
  
  // let group = Body.nextGroup(true);
  let ring = new Chain(
      world,
      { x: 200, y: 200, num: 40, distX: 150, distY: 150, xLink: 0.0, yLink: 0.5, closed: true, color: 'blue', linkDraw: true,
      //  create: (bx, by) => Matter.Bodies.rectangle(bx, by, 20, 30) }, // , { collisionFilter: { group: group } }
       create: (bx, by) => Matter.Bodies.circle(bx, by, 10, { frictionAir: 0.01 }) }, // , { collisionFilter: { group: group } }
      { stiffness: 0.8, length: 2}
  );
  blocks.push(ring);
  // group = Body.nextGroup(true);
  let chain = new Chain(
      world,
      { x: 450, y: 20, num: 25, distX: 0, distY: 20, xLink: 0.0, yLink: 0.5, closed: false, color: 'red', linkDraw: true,
       create: (bx, by) => Matter.Bodies.rectangle(bx, by, 20, 10) }, // , { collisionFilter: { group: group } }
      //  create: (bx, by) => Matter.Bodies.circle(bx, by, 10, { collisionFilter: { group: group } }) }, // , { collisionFilter: { group: group } }
      { stiffness: 0.8, length: 2}
  );
  blocks.push(chain);
  // group = Body.nextGroup(true);
  let bridge = new Chain(
      world,
      { x: 20, y: 500, num: 20, distX: 20, distY: 0, xLink: 0.5, yLink: 0.0, fix: {beg: {x: 20, y: 400, options: { stiffness: 0.0, length: 200 }}, end: {x: 400, y: 300, options: { stiffness: 0.0, length: 100 }}}, color: 'green', linkDraw: true,
       create: (bx, by) => Matter.Bodies.rectangle(bx, by, 10, 10) }, // , { collisionFilter: { group: group } }
      //  create: (bx, by) => Matter.Bodies.circle(bx, by, 10, { collisionFilter: { group: group } }) }, // , { collisionFilter: { group: group } }
      { stiffness: 0.8, length: 2}
  );
  blocks.push(bridge);

  // add ball
  ball = new Ball(world, { x: 150, y: 100, r: 30, color: 'red' });

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Engine.run(engine);
}

function draw() {
  background(0);
  clear();
  blocks.forEach((block) => block.draw());
  ball.draw();
  mouse.draw();
}
