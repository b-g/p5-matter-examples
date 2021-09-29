const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const Events = Matter.Events;
const World = Matter.World;

// the Matter engine to animate the world
let engine;
let world;
let mouse;
// an array to contain all the blocks created
let blocks = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('thecanvas');

  engine = Engine.create();
  world = engine.world;

  // create some blocks
  // the blue box triggers a function on collisions
  blocks.push(new BlockCore(
    world,
    {
      x: 200, y: 200, w: 60, h: 60,
      color: 'blue',
      trigger: (ball, block) => {
        // console.log("Trigger ", ball, block, puzzle);
        puzzle.attrs.color = 'magenta';
      }
    },
    { isStatic: false, density: 0.5 }
  ));

  const fixed1 = new Block(
    world,
    {
      x: 700, y: 200, w: 40, h: 40,
      color: 'cyan'
    },
    { isStatic: false }
  );
  fixed1.constrainTo(null, { pointB: { x: 900, y: 300 }, length: 300 });
  blocks.push(fixed1);

  const fixed2 = new Block(
    world,
    {
      x: 800, y: 200, w: 40, h: 40,
      color: 'cyan'
    },
    { isStatic: false }
  );
  fixed2.constrainTo(fixed1, { length: 150, stiffness: 0.1 });
  blocks.push(fixed2);

  blocks.push(new BlockCore(
    world,
    {
      x: windowWidth / 2, y: 800, w: windowWidth, h: 10,
      color: 'gray'
    },
    { isStatic: true }
  ));

  blocks.push(new BlockCore(
    world,
    {
      x: -100, y: 450, w: 800, h: 10,
      color: 'gray'
    },
    { angle: PI / 3, isStatic: true }
  ));

  blocks.push(new BlockCore(
    world,
    {
      x: windowWidth + 100, y: 450, w: 800, h: 10,
      color: 'gray'
    },
    { angle: -PI / 3, isStatic: true }
  ));

  // the ball has a label and can react on collisions
  blocks.push(new Ball(
    world,
    {
      x: 300, y: 300, r: 30,
      color: 'magenta'
    },
    { label: "Murmel" }
  ));

  // create a rotating block - propeller
  blocks.push(new Block(
    world,
    {
      x: 640, y: 440, w: 100, h: 5,
      color: 'white',
      rotate: { angle: 0, delta: 0.07 }
    },
    { isStatic: true }
  ));

  // create a body from multiple parts
  blocks.push(new Parts(
    world,
    {
      x: 900, y: 730,
      color: 'blue'
    },
    {
      parts: [
        Bodies.rectangle(4, 20, 5, 20),
        Bodies.rectangle(40 - 4, 20, 5, 20),
        Bodies.rectangle(20, +40 - 4, 50, 5)
      ],
      isStatic: true,
      friction: 0.0
    }
  ));

  // create a body from points
  blocks.push(new PolygonFromPoints(
    world,
    {
      x: 600,
      y: 580,
      points: [
        { x: 0, y: 0 }, { x: 20, y: 10 }, { x: 200, y: 30 }, { x: 220, y: 50 }, { x: 10, y: 20 }
      ],
      color: 'olive'
    }, { isStatic: true }));

  // create a body from a SVG path
  // the puzzle can apply a force on collisions 
  const puzzle = new PolygonFromSVG(
    world,
    {
      x: 300, y: 500,
      elem: 'puzzle',
      scale: 0.6, color: 'lime',
      force: { x: 0.0, y: -0.04 }
    },
    { isStatic: true, friction: 0.0 }
  );
  blocks.push(puzzle);

  blocks.push(new PolygonFromSVG(
    world,
    {
      x: 580, y: 710,
      file: './path.svg',
      scale: 0.6, color: 'yellow'
    },
    { isStatic: true, friction: 0.0 }
  ));

  // create a group of identical bodies
  blocks.push(new Stack(
    world,
    {
      x: 550,
      y: 100,
      cols: 10,
      rows: 10,
      colGap: 5,
      rowGap: 5,
      color: 'red',
      create: (bx, by) => Bodies.circle(bx, by, 10, { restitution: 0.9 })
    }, {}));

  // add a mouse so that we can manipulate Matter objects
  mouse = new Mouse(engine, canvas, { stroke: 'blue', strokeWeight: 3 });

  // process mouseup events in order to - add more balls
  mouse.on("mouseup", evt => {
    let ball = new Ball(world, { x: evt.mouse.position.x, y: evt.mouse.position.y, r: 15, color: 'yellow' }, { isStatic: false, restitution: 0.9, label: 'Murmel' });
    blocks.push(ball);
  });

  // process collisions - check whether block "Murmel" hits another Block
  Events.on(engine, 'collisionStart', function (event) {
    var pairs = event.pairs;
    pairs.forEach((pair, i) => {
      if (pair.bodyA.label == 'Murmel') {
        pair.bodyA.plugin.block.collideWith(pair.bodyB.plugin.block)
      }
      if (pair.bodyB.label == 'Murmel') {
        pair.bodyB.plugin.block.collideWith(pair.bodyA.plugin.block)
      }
    })
  })
  // run the engine
  Engine.run(engine);
}

function draw() {
  background(0, 20);
  noStroke();
  blocks.forEach(block => {
    block.draw();
    if (block.drawConstraints) {
      block.drawConstraints();
    }
  });
}
