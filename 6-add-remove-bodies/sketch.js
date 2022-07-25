let engine;
let world;
let mouse;
let groundLeft;
let groundRight;
let balls = [];


function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  engine = Matter.Engine.create();
  world = engine.world;

  // setup ground
  groundLeft = new Block(world, { x: 200, y: 450, w: 460, h: 30, color: 'grey' }, {
    isStatic: true, angle: PI * 0.15
  });
  groundRight = new Block(world, { x: 600, y: 450, w: 460, h: 30, color: 'grey' }, {
    isStatic: true, angle: PI * -0.15
  });

  // add a mouse to manipulate Matter objects
  mouse = new Mouse(engine, canvas, { stroke: 'magenta', strokeWeight: 2 });

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background(0);

  fill(255);
  textAlign(CENTER, CENTER);
  text('Click: New Body\nRight Click: Remove Body', width/2, 50);

  noStroke();
  fill(255);
  for (const ball of balls) {
    ball.draw();
  }

  fill(128);
  groundLeft.draw();
  groundRight.draw();
  mouse.draw();
}

function addBody() {
  const newBall = new Ball(world,{ x: mouseX, y: mouseY, r: random(5, 100), color: 'white' });
  balls.push(newBall);
}

function removeBody() {
  // search all bodies on current mouse position
  const bodies = Matter.Composite.allBodies(engine.world);
  const found = Matter.Query.point(bodies, {x: mouseX, y: mouseY});
  if (found.length > 0) {
    const clickedBody = found[0];
    Matter.World.remove(world, clickedBody);
    balls = balls.filter(ball => ball.body !== clickedBody);
  }
}

// disable right click context menu
document.oncontextmenu = function() {
  return false;
}

function mouseReleased(event) {
  if (mouseButton === LEFT) {
    addBody();
  }
  if (mouseButton === RIGHT) {
    removeBody();
  }
}
