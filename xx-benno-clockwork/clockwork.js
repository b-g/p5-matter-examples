const Engine = Matter.Engine;
const Runner = Matter.Runner;
const World = Matter.World;
const Events = Matter.Events;
const Bodies = Matter.Bodies;

// the Matter engine to animate the world
let engine, runner, world, mouse;
let isDrag = false;
// 4512 2538
const dim = { w: 2560, h: 1600 }
let off = { x: 0, y: 0 }
let blocks = [];
let murmel, canvasElem
const testBall = 'red'

// collisionFilter: {group: 0x00, category: 0b0000 0000 0000 0001, mask: 0b1111 1111 1111 1111}
// collision of A and B: group > 0 && groupA == groupB          ,
// no collision of A and B: group < 0 && groupA == groupB
// groupA != groupB: 
// collision of A and B ? (categoryA & maskB) !== 0 && (categoryB & maskA) !== 0
const cfM = { group: 0, category: 0x0002, mask: 0x0021 }
const cfX = { group: 0, category: 0x0004, mask: 0xFFFF }

const setCollide = (cfA, cfB, on) => {
  cfA.mask = on ? cfA.mask | cfB.category : cfA.mask & (~cfB.category & 0xFF)
  // console.log(cfA.mask.toString(2))
}
const doesCollide = (cfA, cfB) => {
  return (cfA.mask & cfB.category) !== 0 && (cfB.mask & cfA.category) !== 0
}

function preload() {
}

function setup() {
  console.log(windowWidth, windowHeight);
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
      addMurmel({ x: evt.mouse.position.x, y: evt.mouse.position.y }, testBall, murmel.body.collisionFilter)
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
  // Den Motor von Matter starten: die Physik wird berechnet
  Runner.run(runner, engine);
}

function createScene() {

  new BlocksFromSVG(world, 'frame.svg', [],
    { isStatic: true, restitution: 0.0, friction: 0.0, frictionAir: 0.0 },
    {
      save: false, sample: 40, offset: { x: -100, y: -100 }, done: (added, time, fromCache) => {
        console.log('FRAME', added, time, fromCache)
        added.frameB.attributes.trigger = (ball, block) => {
          if (ball.attributes.color == testBall) {
            Matter.Composite.remove(engine.world, ball.body)
            blocks = blocks.filter(block => block != ball)
          }
        }
      }
    });

  new BlocksFromSVG(world, 'static.svg', blocks,
    { isStatic: true, restitution: 0.0, friction: 0.0, frictionAir: 0.0 },
    {
      save: false, sample: 10, offset: { x: 0, y: 0 }, done: (added, time, fromCache) => {
        console.log('STATIC', added, time, fromCache)
      }
    });
  murmel = addMurmel({x: 700, y: 300}, '#404040', cfM)
}

function addMurmel(point, color, filter) {
  const ball = new Ball(
    world,
    { x: point.x, y: point.y, r: 30, color: color },
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
  blocks.forEach(block => block.draw());
  mouse.draw();
}
