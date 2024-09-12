const Engine = Matter.Engine;
const Runner = Matter.Runner;
const World = Matter.World;
const Events = Matter.Events;
const Bodies = Matter.Bodies;

// the Matter engine to animate the world
let engine, runner, world, mouse;
let isDrag = false;

const dim = { w: 1280, h: 2304, m: 1280 / 2 - 42 }
let off = { x: 0, y: 0 }
let start = { x: dim.w + 40, y: dim.h - 610 }
let actTime
const forces = { gravity: 0.2, spring: 0.1, flipper: -1.0, flipperTop: -1.0 }
// arrays to contain the blocks created
let frame = [];
let layer0 = [];
let layer1 = [];
let switches = [];
let blocks = [];
let murmel, spring, springY, canvasElem, flipperTop, flipperLeft, flipperRight
let flipperLImg, flipperLRImg, plungerImg, ballImg

// collisionFilter: {group: 0x00, category: 0b0000 0000 0000 0001, mask: 0b1111 1111 1111 1111}
// collision of A and B: group > 0 && groupA == groupB          ,
// no collision of A and B: group < 0 && groupA == groupB
// groupA != groupB: 
// collision of A and B ? (categoryA & maskB) !== 0 && (categoryB & maskA) !== 0
const cfM = { group: 0, category: 0x0002, mask: 0x0021 }
const cfX = { group: 0, category: 0x0004, mask: 0xFFFF }
const cfL0 = { group: 0, category: 0x0001, mask: 0xFFFF }
const cfS0 = { group: 0, category: 0x0008, mask: 0xFFFF }
const cfL1 = { group: 0, category: 0x0010, mask: 0xFFFE }
const cfFS = { group: 0, category: 0x0020, mask: 0xFFFF }

const setCollide = (cfA, cfB, on) => {
  cfA.mask = on ? cfA.mask | cfB.category : cfA.mask & (~cfB.category & 0xFF)
  // console.log(cfA.mask.toString(2))
}
const doesCollide = (cfA, cfB) => {
  return (cfA.mask & cfB.category) !== 0 && (cfB.mask & cfA.category) !== 0
}

const layerOn = (ball, block) => {
  setCollide(murmel.body.collisionFilter, cfL0, false)
  setCollide(murmel.body.collisionFilter, cfL1, true)
  // console.log('ON layer1')
}

const layerOff = (ball, block) => {
  setCollide(murmel.body.collisionFilter, cfL0, true)
  setCollide(murmel.body.collisionFilter, cfL1, false)
  // console.log('OFF layer1')
}

function onKeyDown(evt) {
  switch (evt.code) {
    case 'Space':
    case 'ArrowDown':
      Matter.Body.setPosition(spring.body, { x: spring.body.position.x, y: Math.min(springY + 60, spring.body.position.y + 5) })
      break
    case 'MetaRight':
    case 'ArrowRight':
      Matter.Body.applyForce(flipperRight.body, flipperRight.body.position, { x: 0, y: forces.flipper });
      break
    case 'MetaLeft':
    case 'ArrowLeft':
      Matter.Body.applyForce(flipperTop.body, flipperTop.body.position, { x: 1, y: forces.flipperTop });
      Matter.Body.applyForce(flipperLeft.body, flipperLeft.body.position, { x: 0, y: forces.flipper });
      break
    default:
      console.log(evt.key, evt.code)
  }
}

function onKeyUp(evt) {
  switch (evt.code) {
    case 'Space':
    case 'ArrowDown':
      Matter.Body.setStatic(spring.body, false)
      setTimeout(() => {
        Matter.Body.setPosition(spring.body, { x: spring.body.position.x, y: springY })
        Matter.Body.setStatic(spring.body, true)
      }, 800)
      break
    case 'MetaRight':
    case 'ArrowRight':
      break
    case 'MetaLeft':
    case 'ArrowLeft':
      break
    default:
    // console.log(evt)
  }
}

function preload() {
  flipperLImg = loadImage('./flipperL.png');
  flipperRImg = loadImage('./flipperR.png');
  plungerImg = loadImage('./plunger.png');
  ballImg = loadImage('./ball.png');
}

function setup() {
  canvasElem = document.getElementById('thecanvas')
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('thecanvas');

  engine = Engine.create();
  runner = Runner.create({ isFixed: true, delta: 1000 / 60 })
  world = engine.world;

  mouse = new Mouse(engine, canvas, { stroke: 'blue', strokeWeight: 3 });

  // Oder auch Test-Murmeln in Spiel bringen
  mouse.on("startdrag", evt => {
    isDrag = true;
  });
  mouse.on("mouseup", evt => {
    if (!isDrag) {
      addMurmel({ x: evt.mouse.position.x, y: evt.mouse.position.y }, 'yellow', murmel.body.collisionFilter)
    }
    isDrag = false;
  });

  // Hier wird registriert, ob die Murmel mit etwas kollidiert und
  // dann die trigger-Funktion des getroffenen Blocks ausgelöst
  // Dieser Code ist DON'T TOUCH IT - wenn das Bewdürfnis besteht, bitte mit Benno reden!!!
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

  createScene();
  document.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("keyup", onKeyUp, true);

  // Den Motor von Matter starten: die Physik wird berechnet
  actTime = Date.now()
  Runner.run(runner, engine);
}

function createScene() {

  new BlocksFromSVG(world, 'frame.svg', frame,
    { isStatic: true, restitution: 0.0, friction: 0.0, frictionAir: 0.0, collisionFilter: cfFS },
    {
      save: false, sample: 40, offset: { x: -120, y: -120 }, done: (added, time, fromCache) => {
        console.log('FRAME', added, time, fromCache)
        added.frameB.attributes.trigger = (ball, block) => {
          if (ball.attributes.color == 'yellow') {
            Matter.Composite.remove(engine.world, ball.body)
            blocks = blocks.filter(block => block != ball)
          } else {
            layerOff(ball, block)
            Matter.Body.setPosition(ball.body, start)
          }
        }
      }
    });

  new BlocksFromSVG(world, 'layer0.svg', layer0,
    { isStatic: true, restitution: 0.0, friction: 0.0, frictionAir: 0.0 },
    {
      save: false, sample: 40, offset: { x: 0, y: 0 }, done: (added, time, fromCache) => {
        console.log('LAYER0', added, time, fromCache)
        added.sideMR.body.collisionFilter = cfS0
      }
    });

  new BlocksFromSVG(world, 'layer1.svg', layer1,
    { isStatic: true, restitution: 0.0, friction: 0.0, frictionAir: 0.0, collisionFilter: cfL1 },
    {
      save: false, sample: 40, offset: { x: 0, y: 0 }, done: (added, time, fromCache) => {
        console.log('LAYER1', added, time, fromCache)
      }
    });

  new BlocksFromSVG(world, 'switches.svg', switches,
    { isStatic: true, isSensor: true, restitution: 0.0, friction: 0.0, frictionAir: 0.0, collisionFilter: cfFS },
    {
      save: false, sample: 40, offset: { x: 0, y: 0 }, done: (added, time, fromCache) => {
        console.log('SWITCHES', added, time, fromCache)
        added.switch1D.attributes.trigger = (ball, block) => {
          setCollide(murmel.body.collisionFilter, cfS0, false)
          // console.log('PASS')
        }
        added.switch1A.attributes.trigger = (ball, block) => {
          setCollide(murmel.body.collisionFilter, cfS0, true)
          // console.log('BLOCK')
        }
        added.switch4A.attributes.trigger = layerOn
        added.switch4D.attributes.trigger = layerOff
        added.switch5A.attributes.trigger = layerOn
        added.switch5D.attributes.trigger = layerOff

        added.loop1BL.body.collisionFilter = cfX
        added.loop1BR.body.collisionFilter = cfX
        added.loop1BT.body.collisionFilter = cfL1
        added.loop1BB.body.collisionFilter = cfL1

        added.switch6.attributes.trigger = (ball, block) => {
          added.loop1BL.body.collisionFilter = cfL1
          added.loop1BR.body.collisionFilter = cfL1
          added.loop1BT.body.collisionFilter = cfX
          added.loop1BB.body.collisionFilter = cfX
        }
        added.switch7.attributes.trigger = (ball, block) => {
          added.loop1BL.body.collisionFilter = cfX
          added.loop1BR.body.collisionFilter = cfX
          layerOff(ball, block)
        }
      }
    });

  // blocks.push(new Ball(
  //   world,
  //   { x: 150, y: 800, r: 30, color: 'lime', trigger: (ball, block) => {
  //     setCollide(murmel.body.collisionFilter, cf2, true)
  //     console.log('ON layer1')
  //   } },
  //   { isStatic: true, isSensor: true }
  // ));

  flippers()
  plunger(dim.w - 40, dim.h - 45)
  world.gravity.y = forces.gravity
}

function flippers() {
  flipperTop = createFlipper(95, 938, true, -65, './flipperL.svg')
  stopper(110, 1110)
  stopper(200, 880)
  flipperLeft = createFlipper(dim.w / 2 - 258, dim.h - 158, true, -65, './flipperL.svg')
  stopper(dim.m - 142, dim.h - 50)
  stopper(dim.m - 140, dim.h - 300)
  flipperRight = createFlipper(dim.w / 2 + 178, dim.h - 158, false, 65, './flipperR.svg')
  stopper(dim.m + 142, dim.h - 48)
  stopper(dim.m + 140, dim.h - 300)
}

function createFlipper(x, y, isLeft, offX, file) {
  const flipper = new PolygonFromSVG(
    world,
    {
      x: x, y: y, fromFile: isLeft ? './flipperL.svg' : './flipperR.svg', color: 'lime', image: isLeft ? flipperLImg : flipperRImg, done: (block) => {
        block.constrainTo(null, { pointA: { x: isLeft ? -65 : 65, y: 0 }, pointB: { x: x - 0, y: y }, length: 0, draw: true });
      }
    },
    { isStatic: false, friction: 0.0, frictionAir: 0.0 });
  blocks.push(flipper);
  return flipper
}

function stopper(x, y) {
  blocks.push(new Ball(
    world,
    { x: x, y: y, r: 30 },
    { isStatic: true, collisionFilter: cfX }
  ));
}

function plunger(x, y) {
  spring = new Block(
    world,
    {
      x: x, y: y, w: 60, h: 80, image: plungerImg, color: 'yellow', trigger: (ball, block) => {
        // console.log(Date.now() - actTime)
        actTime = Date.now()
      }
    },
    { isStatic: false, friction: 0.0, frictionAir: 0.0 }
  )
  spring.constrainTo(null, { pointA: { x: -20, y: -30 }, pointB: { x: x - 20, y: y - 40 }, length: 0, stiffness: forces.spring, draw: true })
  spring.constrainTo(null, { pointA: { x: 20, y: -30 }, pointB: { x: x + 20, y: y - 40 }, length: 0, stiffness: forces.spring })
  blocks.push(spring);
  setTimeout(() => {
    springY = spring.body.position.y
    Matter.Body.setStatic(spring.body, true)
    f = 0
  }, 800)

  // Die Murmel hat das label "Murmel" verursacht Kollisionen, die die trigger-Funktion
  // des getroffene Blocks auslöst 
  murmel = addMurmel(start, '#404040', cfM)
}

function addMurmel(point, color, filter) {
  const ball = new Ball(
    world,
    { x: point.x, y: point.y, r: 30, color: color, ximage: ballImg },
    {
      label: "Murmel", restitution: 0.0, friction: 0.0, frictionAir: 0.0, isStatic: false,
      collisionFilter: filter
    }
  )
  blocks.push(ball)
  return ball
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
  if (doesCollide(murmel.body.collisionFilter, cfL0)) {
    layer0.forEach(block => block.draw());
  }
  if (doesCollide(murmel.body.collisionFilter, cfL1)) {
    layer1.forEach(block => block.draw());
  }
  // switches.forEach(block => block.draw());
  // frame.forEach(block => block.draw());
  blocks.forEach(block => block.draw());
  mouse.draw();
}
