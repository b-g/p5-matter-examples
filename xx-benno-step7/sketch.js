const Engine = Matter.Engine;
const Runner = Matter.Runner;
const Bodies = Matter.Bodies;
const Events = Matter.Events;
const World = Matter.World;

// the Matter engine to animate the world
let engine;
let world;
let mouse;
let isDrag = false;
// an array to contain all the blocks created
let blocks = [];

let propeller, riesenrad;
let angleProp = 0;
let angleRad = 0;

let poly, ballImg, blockImg;
let magnet;

function preload() {
  poly = loadImage('./poly.png');
  ballImg = loadImage('./ball.png');
  boxImg = loadImage('./box.png');
}

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
      x: 200, y: 200, w: 60, h: 60, color: 'blue',
      trigger: (ball, block) => {
        // console.log("Trigger ", ball, block, puzzle);
        puzzle.attributes.color = 'magenta';
      }
    },
    { isStatic: false, density: 0.5 }
  ));

  const fixed1 = new Block(
    world,
    { x: 700, y: 200, w: 40, h: 40, color: 'cyan' },
    { isStatic: false }
  );
  fixed1.constrainTo(null,
    { pointB: { x: 900, y: 300 }, length: 300, draw: true });
  blocks.push(fixed1);

  const fixed2 = new Block(
    world,
    { x: 800, y: 200, w: 40, h: 40, color: 'cyan' },
    { isStatic: false }
  );
  fixed2.constrainTo(fixed1,
    { length: 150, stiffness: 0.1 });
  blocks.push(fixed2);

  blocks.push(new BlockCore(
    world,
    { x: windowWidth / 2, y: 800, w: windowWidth, h: 30, color: 'gray' },
    { isStatic: true }
  ));

  blocks.push(new BlockCore(
    world,
    { x: -100, y: 450, w: 800, h: 10, color: 'gray' },
    { angle: PI / 3, isStatic: true }
  ));

  blocks.push(new BlockCore(
    world,
    { x: windowWidth + 100, y: 450, w: 800, h: 10, color: 'gray' },
    { angle: -PI / 3, isStatic: true }
  ));

  // the ball has a label and can react on collisions
  blocks.push(new Ball(
    world,
    { x: 300, y: 300, r: 30, color: 'magenta' },
    { label: "Murmel" }
  ));

  // create a rotating block - propeller
  propeller = new Block(
    world,
    { x: 640, y: 440, w: 100, h: 5, color: 'white' },
    { isStatic: true }
  );

  // create a body from multiple parts
  blocks.push(new Parts(
    world,
    { x: 900, y: 730, image: boxImg, offset: { x: 0, y: -20.0 } },
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

  // create a body from a SVG path
  // the puzzle can apply a force on collisions
  const puzzle = new PolygonFromSVG(
    world,
    { x: 300, y: 500, fromId: 'puzzle', scale: 0.6, color: 'lime', force: { x: 0.0, y: -0.04 } },
    { isStatic: true, friction: 0.0 });
  blocks.push(puzzle);

  let ball2 = new Ball(
    world,
    { x: 300, y: 300, r: 30, color: 'white' },
    { isSensor: true }
  );
  ball2.constrainTo(puzzle,
    { length: 20, stiffness: 0.1, draw: true, color: 'green' });
  blocks.push(ball2);

  blocks.push(new PolygonFromSVG(
    world,

    { x: 580, y: 710, fromFile: './path.svg', scale: 0.6, color: 'yellow' },
    { isStatic: true, friction: 0.0 }
  ));

  let polyBlock = new PolygonFromSVG(
    world,
    { x: 500, y: 200, fromFile: './poly.svg', scale: 1, color: '#FFFFFF40', image: poly },
    { isStatic: false, friction: 0.0 }
  )

  blocks.push(polyBlock);

  magnet = new Magnet(
    world,
    { x: 1000, y: 400, r: 30, color: 'blue', attraction: 0.25e-5 },
    { isStatic: true }
  );
  blocks.push(magnet);

  // create a group of identical bodies
  let stack = new Stack(
    world,
    { x: 550, y: 100, cols: 10, rows: 10, colGap: 5, rowGap: 5, color: 'red', create: (bx, by) => Bodies.circle(bx, by, 10, { restitution: 0.9 }) },
    {})
  blocks.push(stack);

  // bridge "handgemacht"
  const base = 800;
  for (let i = 0; i < 15; i++) {
    let block = new Block(world,
      { x: base + i * 55, y: 500, w: 50, h: 30, color: 'white' },
      { isStatic: false })
    if (i == 0) {
      block.constrainTo(null, { pointA: { x: -20, y: 0 }, pointB: { x: base - 200, y: 500 }, stiffness: 0.1, draw: true });
    } else {
      block.constrainTo(blocks[blocks.length - 1], { pointA: { x: -20, y: 0 }, pointB: { x: 20, y: 0 }, stiffness: 0.5, draw: true });
    }
    blocks.push(block);
  }
  blocks[blocks.length - 1].constrainTo(null,
    { pointA: { x: 20, y: 0 }, pointB: { x: base + 900, y: 300 }, length: 200, stiffness: 0.1, draw: true });

  // chain[2].removeConstraint(chain[2].constraints[0]);

  magnet.addAttracted(stack.body.bodies)

  // add box, ball, ramp and ground
  blocks.push(new Block(world, { x: 200, y: 0, w: 64, h: 64, image: boxImg }));
  blocks.push(new Ball(world, { x: 100, y: 50, r: 45, image: ballImg }));

  // Riesenrad
  const cnt = 8;
  const radius = 200;
  const pos = { x: 1100, y: 300 };
  riesenrad = new Ball(
    world,
    { x: pos.x, y: pos.y, r: radius, stroke: "white", scale: 0.65, },
    { isStatic: false, isSensor: true }
  );

  blocks.push(riesenrad);
  riesenrad.constrainTo(null,
    {
      pointB: pos,
      stiffness: 1.0,
      draw: true,
      //color: "yellow",
    });

  // Gondeln
  for (let i = 0; i < cnt; i++) {
    let x = (radius - 10) * Math.sin(((2 * PI) / cnt) * i);
    let y = (radius - 10) * Math.cos(((2 * PI) / cnt) * i);

    const gondel = new PolygonFromSVG(
      world,
      { x: pos.x + x, y: pos.y + 30 + y, fromFile: './gondel.svg', color: 'yellow', sample: 10 },
      { isStatic: false }
    )

    // for some reason, the constraints need to be added "later"
    setTimeout(() => {
      gondel.constrainTo(riesenrad, { pointA: { x: 0, y: -10 }, pointB: { x: x, y: y }, length: 50,  stiffness: 1.0, damping: 0.9, color: 'yellow', draw: true, });
    }, 100)
    blocks.push(gondel);
  }

  // create a body from points
  blocks.push(new PolygonFromPoints(
    world,
    { x: 800, y: 100, points: [{ x: 0, y: 0 }, { x: 20, y: 10 }, { x: 200, y: 30 }, { x: 220, y: 50 }, { x: 10, y: 20 }], color: 'olive' },
    { isStatic: true, angle: 0.1 }));

    setInterval(() => {
    blocks.push(new Ball(world,
      { x: 800, y: 80, r: 15, color: 'magenta' },
      { isStatic: false, restitution: 0.9, friction: 0.0 }))
  }, 5000)

  // add a mouse so that we can manipulate Matter objects
  mouse = new Mouse(engine, canvas, { stroke: 'blue', strokeWeight: 3 });
  // const mouseScale = 1 + (1 / (scale / (1 - scale)))
  // Mouse.setScale(mouse, { x: mouseScale, y: mouseScale });

  // process mouseup events in order to drag objects or add more balls
  mouse.on("startdrag", evt => {
    isDrag = true;
  });
  mouse.on("mouseup", evt => {
    if (!isDrag) {
      let ball = new Ball(world,
        { x: evt.mouse.position.x, y: evt.mouse.position.y, r: 15, color: 'yellow' },
        { isStatic: false, restitution: 0.9, label: 'Murmel' });
      blocks.push(ball);
    }
    isDrag = false;
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
  Runner.run(engine);
}

function draw() {
  background(0, 60);
  // animate attracted blocks
  magnet.attract();

  // animate angle property of propeller
  Matter.Body.setAngle(propeller.body, angleProp);
  Matter.Body.setAngularVelocity(propeller.body, 0.15);
  angleProp += 0.07;
  propeller.draw();

  Matter.Body.setAngle(riesenrad.body, angleRad += 0.02);
  // Matter.Body.setAngularVelocity(riesenrad.body, 0.15);

  blocks.forEach(block => block.draw());
  mouse.draw();
}
