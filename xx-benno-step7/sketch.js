const Engine = Matter.Engine;
const Runner = Matter.Runner;
const World = Matter.World;
const Events = Matter.Events;
const Bodies = Matter.Bodies;

// the Matter engine to animate the world
let engine, runner, world, mouse;
let isDrag = false;

// some sizes to allow view follow and endless scrolling
const dim = { w: 3840, h: 2160 }
let off = { x: 0, y: 0 }
let canvasElem

// an array to contain all the blocks created
let blocks = [];

// the "Murmel"
let murmel;
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
  canvasElem = document.getElementById('thecanvas')
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('thecanvas');

  engine = Engine.create();
  runner = Runner.create({ isFixed: true, delta: 1000 / 60 })
  world = engine.world;

  // Während der Enticklung der Murmelbahn kan man mit der Maus eingreifen
  mouse = new Mouse(engine, canvas, { stroke: 'blue', strokeWeight: 3 });

  // Oder auch Test-Murmeln in Spiel bringen
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

  // Hier wird registriert, ob die Murmel mit etwas kollidiert und
  // dann die trigger-Funktion des getroffenen Blocks ausgelöst
  // Dieser Code ist DON'T TOUCH IT - wenn das Bedürfnis besteht, bitte mit Benno reden!!!
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

  Events.on(engine, 'collisionActive', function (event) {
    var pairs = event.pairs;
    pairs.forEach((pair, i) => {
      if (pair.bodyA.label == 'Murmel' && pair.bodyB.label == 'Active') {
        pair.bodyA.plugin.block.collideWith(pair.bodyB.plugin.block)
      }
      if (pair.bodyB.label == 'Murmel' && pair.bodyA.label == 'Active') {
        pair.bodyB.plugin.block.collideWith(pair.bodyA.plugin.block)
      }
    })
  })

  // Die Murmelbahn erzeugen
  createScene();
  // Den Motor von Matter starten: die Physik wird berechnet
  Runner.run(runner, engine);
}

function createScene() {

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
  murmel = new Ball(
    world,
    { x: 300, y: 300, r: 30, color: 'magenta' },
    { label: "Murmel" }
  )
  blocks.push(murmel);

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
      {
        x: pos.x + x, y: pos.y + 30 + y, fromFile: './gondel.svg', color: 'yellow', sample: 10, done: (added, isSync) => {
          // console.log('DONE', added, isSync)
          added.constrainTo(riesenrad, { pointA: { x: 0, y: -10 }, pointB: { x: x, y: y }, stiffness: 1.0, damping: 0.9, color: 'yellow', draw: true, });
        }
      },
      { isStatic: false }
    )
    blocks.push(gondel);
  }

  // create a body from points
  blocks.push(new PolygonFromPoints(
    world,
    { x: 800, y: 100, points: [{ x: 0, y: 0 }, { x: 20, y: 10 }, { x: 200, y: 30 }, { x: 220, y: 50 }, { x: 10, y: 20 }], color: 'olive' },
    { isStatic: true, angle: 0.1 }));

  setInterval(() => {
    blocks.push(new Ball(world,
      { x: 800, y: 80, r: 15, color: 'lime' },
      { isStatic: false, restitution: 0.9, friction: 0.0 }))
  }, 5000)

}

function scrollEndless(point) {
  // wohin muss verschoben werden damit point wenn möglich in der Mitte bleibt
  off = { x: Math.min(Math.max(0, point.x - window.innerWidth / 2), dim.w - window.innerWidth), y: Math.min(Math.max(0, point.y - window.innerHeight / 2), dim.h - window.innerHeight) }
  // plaziert den Canvas im aktuellen Viewport
  canvasElem.style.left = Math.round(off.x) + 'px'
  canvasElem.style.top = Math.round(off.y) + 'px'
  // korrigiert die Koordinaten
  translate(-off.x, -off.y)
  // verschiebt den ganzen Viewport
  window.scrollTo(off.x, off.y)
  mouse.setOffset(off)
}

function draw() {
  clear();

  if (murmel) {
    scrollEndless(murmel.body.position)
  }

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
