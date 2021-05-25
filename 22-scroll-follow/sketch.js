// Benedikt Groß

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;

const drawBody = Helpers.drawBody;
const drawBodies = Helpers.drawBodies;

let canvas;
let engine;
let ball;
let layers = [];

function setup() {
  canvas = createCanvas(1000, 2000);

  for (let i = 0; i < 9; i++) {
    const x = (i % 2 == 0) ? 250 : 650;
    const a = (i % 2 == 0) ? Math.PI * 0.06 : Math.PI * -0.06;
    layers.push(Bodies.rectangle(x, 200 * (i + 1), 800, 30, { isStatic: true, angle: a }));
  }
  ball = Bodies.circle(100, 50, 40);
  engine = Engine.create();
  World.add(engine.world, [ball, ...layers]);
  Engine.run(engine);
}

function draw() {
  background(0);

  // follow the ball by scrolling the window
  scrollFollow(ball);

  noStroke();
  fill(255);
  drawBody(ball);
  
  fill(128);
  drawBodies(layers);
}

function keyPressed(e) {
  // prevent scrolling of website with SPACE key
  if(e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
}

function scrollFollow(matterObj) {
  if (insideViewport(matterObj) == false) {
    const $element = $('html, body');
    if ($element.is(':animated') == false) {
      $element.animate({
        scrollLeft: ball.position.x,
        scrollTop: ball.position.y
      }, 1000);
    }
  }
}

function insideViewport(matterObj) {
  const x = matterObj.position.x;
  const y = matterObj.position.y;
  const pageXOffset = window.pageXOffset || document.documentElement.scrollLeft;
  const pageYOffset  = window.pageYOffset || document.documentElement.scrollTop;
  if (x >= pageXOffset && x <= pageXOffset + windowWidth &&
      y >= pageYOffset && y <= pageYOffset + windowHeight) {
    return true;
  } else {
    return false;
  }
}
