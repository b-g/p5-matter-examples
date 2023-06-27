const Engine = Matter.Engine;
const Runner = Matter.Runner;
const Bodies = Matter.Bodies;
const Events = Matter.Events;
const World = Matter.World;

// the Matter engine to animate the world
let engine;
let world;
let mouse;
let ball;
let isDrag = false;

let canvasElem;
let off = { x: 0, y: 0 };

// das ist die Dimension einer Szene / eines Levels
const dim = { w: 3840, h: 2160 };

// an array to contain all the blocks created
let blocks = [];

// an array to contain all the scene functions
let scenes = [scene1, scene2];
let scene = 0;
let sceneBack, sceneFore;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('thecanvas');

  // Das ist nötig für den 'Endless Canvas'
  canvasElem = document.getElementById('thecanvas');

  engine = Engine.create();
  world = engine.world;

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
      let ball = new Ball(world, { x: evt.mouse.position.x, y: evt.mouse.position.y, r: 15, color: 'yellow' }, { isStatic: false, restitution: 0.9, label: 'Murmel', density: 0.5 });
      Matter.Body.applyForce(ball.body, ball.body.position, { x: 0.2, y: -2 })
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
  document.addEventListener('keydown', onKeyDown);
  sceneBack = document.getElementById('scene-background');
  sceneFore = document.getElementById('scene-foreground');
  switchScene(0);
}

function scene1() {
  sceneBack.style['background'] = 'url("./scene1.jpg") no-repeat';
  sceneFore.style['background'] = 'url("./scene1_fore.png") no-repeat';

  new BlocksFromSVG(world, 'static.svg', blocks, { isStatic: true });
  blocks.push(new BlockCore(world, { x: dim.w / 2, y: 800, w: dim.w - 400, h: 40, color: 'green' }, { isStatic: true }));

  // the ball has a label and can react on collisions
  ball = new Ball(
    world, {
    x: 300,
    y: 80,
    r: 30,
    color: 'blue'
  }, { label: "Murmel", isStatic: false, xdensity: 0.001, restitution: 1.0, friction: 0.0, frictionAir: 0.0 }
  );
  blocks.push(ball);
}

function scene2() {
  sceneBack.style['background'] = 'url("./scene2.jpg") no-repeat';
  sceneFore.style['background'] = '';

  new BlocksFromSVG(world, 'static.svg', blocks, { isStatic: true });
  blocks.push(new BlockCore(world, { x: dim.w / 2, y: 800, w: dim.w - 200, h: 20, color: 'yellow' }, { angle: radians(3), isStatic: true }));

  // the ball has a label and can react on collisions
  ball = new Ball(
    world, {
    x: 100,
    y: 20,
    r: 10,
    color: 'blue'
  }, { label: "Murmel", isStatic: false, xdensity: 0.001, restitution: 1.0, friction: 0.0, frictionAir: 0.0 }
  );
  blocks.push(ball);
}

function switchScene(newScene) {
  console.log('Scene', newScene)
  // cleanup of all blocks in the old scene
  blocks.forEach(block => Matter.World.remove(world, block.body));
  blocks = [];

  // activate the new scene
  scene = newScene;
  scenes[scene]();
}

function scrollEndless(point) {
  // wohin muss verschoben werden damit point wenn möglich in der Mitte bleibt
  off = { x: Math.min(Math.max(0, point.x - windowWidth / 2), dim.w -  windowWidth), y: Math.min(Math.max(0, point.y - windowHeight / 2), dim.h -  windowHeight) };
  // plaziert den Canvas im aktuellen Viewport
  canvasElem.style.left = Math.round(off.x) + 'px';
  canvasElem.style.top = Math.round(off.y) + 'px';
  // korrigiert die Koordinaten
  translate(-off.x, -off.y);
  // verschiebt den ganzen Viewport
  window.scrollTo(off.x, off.y);
  // Matter mouse needs the offset as well
  mouse.setOffset(off);
}

function draw() {
  clear();
  // position canvas and translate coordinates
  scrollEndless(ball.body.position);

  blocks.forEach(block => block.draw());
  mouse.draw();
}

function onKeyDown(event) {
  switch (event.key) {
    case ' ':
      console.log('SPACE');
      event.preventDefault();
      Matter.Body.applyForce(ball.body, ball.body.position, { x: 0.01 , y: -0.01 })
      break;
    case 'n':
      switchScene((scene + 1) % scenes.length)
      break;
    case 'p':
      switchScene(Math.abs(scene - 1) % scenes.length)
      break;
    default:
      console.log(event.key);
  }
}
