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
let murmel;

let canvasElem;
let off = { x: 0, y: 0 };

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('thecanvas');

  // Das ist nötig für den 'Endless Canvas'
  canvasElem = document.getElementById('thecanvas');

  engine = Engine.create();
  world = engine.world;

  // create some blocks
  // the red box triggers a function on collisions
  blocks.push(new BlockCore(
    world, {
      x: 200,
      y: 200,
      w: 60,
      h: 60,
      color: 'red',
      trigger: (ball, block) => {
        // alert('HIT')
        ball.attributes.color = color(Math.random() * 256, Math.random() * 256, Math.random() * 256);
      }
    }, { isStatic: false, density: 0.05, restitution: 0.5, frictionAir: 0.01 }
  ));

  blocks.push(new BlockCore(
    world, {
      x: windowWidth / 2,
      y: 380,
      w: windowWidth - 300,
      h: 10,
      color: 'green',
      trigger: (ball, block) => {
        // alert('HIT')
        ball.attributes.color = color(Math.random() * 256, Math.random() * 256, Math.random() * 256);
        // Matter.Body.applyForce(ball.body, ball.body.position, { x: 0.5, y: 0.0 });
      }
    }, { isStatic: true }
  ));

  blocks.push(new BlockCore(
    world, {
      x: windowWidth,
      y: 1200,
      w: windowWidth * 2,
      h: 20,
      color: 'blue',
      trigger: (ball, block) => {
        // alert('HIT')
        Matter.Body.applyForce(ball.body, ball.body.position, { x: -0.1, y: -0.5 });
      }
    }, { isStatic: true }
  ));

  // the ball has a label and can react on collisions
  murmel = new Ball(
    world, {
      x: 300,
      y: 100,
      r: 30,
      color: 'magenta'
    }, { label: "Murmel", density: 0.004, frictionAir: 0.0, frictionAir: 0.0 }
  );
  blocks.push(murmel);

  // add a mouse so that we can manipulate Matter objects
  mouse = new Mouse(engine, canvas, { stroke: 'blue', strokeWeight: 3 });

  // process mouseup events in order to drag objects or add more balls
  mouse.on("startdrag", evt => {
    isDrag = true;
  });
  mouse.on("mouseup", evt => {
    if (!isDrag) {
      let ball = new Ball(world, { x: off.x + evt.mouse.position.x, y: off.y + evt.mouse.position.y, r: 15, color: 'yellow' }, { isStatic: false, restitution: 0.9, label: 'Murmel' });
      blocks.push(ball);
    }
    isDrag = false;
  });

  // process collisions - check whether block "Murmel" hits another Block
  Events.on(engine, 'collisionStart', function(event) {
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

function scrollEndless(point) {
  // wohin muss verschoben werden damit point wenn möglich in der Mitte bleibt
  off = { x: Math.max(0, point.x - windowWidth / 2), y: Math.max(0, point.y - windowHeight / 2) };
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

function keyPressed(event) {
  switch (keyCode) {
    case 32:
      console.log("Space");
      event.preventDefault();
      Matter.Body.applyForce(murmel.body, murmel.body.position, { x: 0.2, y: -0.0 });
      // Matter. Body.scale(murmel.body, 1.5, 1.5);
      break;
    default:
      console.log(keyCode);
  }
}


function draw() {
  //background(0,1)
  clear();

  // position canvas and translate coordinates
  scrollEndless(murmel.body.position);

  // animate attracted blocks
  blocks.forEach(block => block.draw());
  mouse.draw();
}
