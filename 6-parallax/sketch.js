let blockA;
let blockB;
let ground;
let mouse;

let bg2;
let bg1;
let fg1;

function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  let engine = Matter.Engine.create();
  let world = engine.world;

  // create two boxes and a ground
  blockA = new Block(world, { x: 200, y: 200, w: 80, h: 80, color: '#F6C780' });
  blockB = new Block(world, { x: 270, y: 50, w: 160, h: 80, color: '#9DD9F2' });
  ground = new Block(world, { x: 400, y: 500, w: 810, h: 15, color: 'grey' }, { isStatic: true, angle: PI/36 });

  // run the engine
  Matter.Runner.run(engine);

  // add a mouse to manipulate Matter objects
  mouse = new Mouse(engine, canvas, { stroke: 'magenta', strokeWeight: 2 });

  // Select the elements from the HTML
  bg2 = selectAll('#background_2');
  bg1 = selectAll('#background_1');
  fg1 = selectAll('#foreground_1');
}

function draw() {

  const horizontalMove = -mouseX

  bg2[0].elt.style.transform = 'translateX(' + horizontalMove * 0.002 + 'px)';
  bg1[0].elt.style.transform = 'translateX(' + horizontalMove * 0.03 + 'px)';
  fg1[0].elt.style.transform = 'translateX(' + horizontalMove * 0.1 + 'px)';

  clear();
  blockA.draw();
  blockB.draw();
  ground.draw();
  mouse.draw();
}
