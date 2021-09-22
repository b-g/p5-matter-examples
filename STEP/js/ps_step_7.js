Homeworks.aufgabe = 7;

const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const Events = Matter.Events;
const World = Matter.World;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

// the Matter engine to animate the world
let engine;
// an array to contain all the blocks created
let blocks = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('thecanvas');

  engine = Engine.create();

  // create some blocks
  // the blue box triggers a function on collisions
  blocks.push(new BaseBlock({
    x: 200, y: 200, w: 60, h: 60,
    color: 'blue',
    trigger: (ball, block) => {
      // console.log("Trigger ", ball, block, puzzle);
      puzzle.attrs.color = 'magenta';
    }
  },
    { isStatic: false, density: 0.5 }
  ));

  const fixed1 = new Block({
    x: 700, y: 200, w: 40, h: 40,
    color: 'cyan'
  },
    { isStatic: false }
  );
  fixed1.constrainTo(null, { pointB: { x: 900, y: 300 }, length: 300 });
  blocks.push(fixed1);

  const fixed2 = new Block({
    x: 800, y: 200, w: 40, h: 40,
    color: 'cyan'
  },
    { isStatic: false }
  );
  fixed2.constrainTo(fixed1, { length: 150, stiffness: 0.1 });
  blocks.push(fixed2);

  blocks.push(new BaseBlock({
    x: windowWidth / 2, y: 800, w: windowWidth, h: 10,
    color: 'gray'
  },
    { isStatic: true }
  ));

  blocks.push(new BaseBlock({
    x: -100, y: 450, w: 800, h: 10,
    color: 'gray'
  },
    { angle: PI / 3, isStatic: true }
  ));

  blocks.push(new BaseBlock({
    x: windowWidth + 100, y: 450, w: 800, h: 10,
    color: 'gray'
  },
    { angle: -PI / 3, isStatic: true }
  ));

  // the ball has a label and can react on collisions
  blocks.push(new Ball({
    x: 300, y: 300, r: 30,
    color: 'magenta'
  },
    { label: "Murmel" }
  ));

  // create a rotating block - propeller
  blocks.push(new Block({
    x: 640, y: 440, w: 100, h: 5,
    color: 'white',
    rotate: { angle: 0, delta: 0.07 }
  },
    { isStatic: true }
  ));

  // create a body from multiple parts
  blocks.push(new ComplexBlock({
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
  blocks.push(new FreehandBlock({
    x: 600,
    y: 580,
    points: [
      { x: 0, y: 0 }, { x: 20, y: 10 }, { x: 200, y: 30 }, { x: 220, y: 50 }, { x: 10, y: 20 }
    ],
    color: 'olive'
  }, { isStatic: true }));

  // create a body from a SVG path
  // the puzzle can apply a force on collisions 
  const puzzle = new SVGBlock({
    x: 300, y: 500,
    elem: 'puzzle',
    scale: 0.6, color: 'lime',
    force: { x: 0.0, y: -0.04 }
  },
    { isStatic: true, friction: 0.0 }
  );
  blocks.push(puzzle);

  blocks.push(new SVGBlock({
    x: 580, y: 710,
    file: './path.svg',
    scale: 0.6, color: 'yellow'
  },
    { isStatic: true, friction: 0.0 }
  ));

  // create a group of identical bodies
  blocks.push(new CompositeBlock({
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
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: Mouse.create(canvas.elt),
    constraint: { stiffness: 0.05, angularStiffness: 0 }
  });
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);

  // process mouseup events in order to - add more balls
  Events.on(mouseConstraint, "mouseup", evt => {
    let ball = new Ball({ x: evt.mouse.position.x, y: evt.mouse.position.y, r: 15, color: 'yellow' }, { isStatic: false, restitution: 0.9, label: 'Murmel' });
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
  console.log(engine.world.constraints)
}

function draw() {
  background(0, 20);
  noStroke();
  blocks.forEach(block => block.draw());
  stroke('white');
  engine.world.constraints.forEach(constraints => drawConstraint(constraints));
}

function drawConstraint(constraint) {
  if (constraint.label == "Mouse Constraint") {
    if (mouseConstraint.body) {
      let pos = mouseConstraint.body.position;
      let offset = mouseConstraint.constraint.pointB;
      let m = mouseConstraint.mouse.position;
      stroke(0, 255, 0);
      strokeWeight(2);
      line(
        pos.x + offset.x,
        pos.y + offset.y,
        m.x,
        m.y
      );
    }
  } else {
    let posA = { x: 0, y: 0 };
    if (constraint.bodyA) {
      posA = constraint.bodyA.position;
    }
    let posB = { x: 0, y: 0 };
    if (constraint.bodyB) {
      posB = constraint.bodyB.position;
    }
    line(
      posA.x + constraint.pointA.x,
      posA.y + constraint.pointA.y,
      posB.x + constraint.pointB.x,
      posB.y + constraint.pointB.y
    );
  }
}
