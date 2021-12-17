let ball;
let slides = [];

function setup() {
  const canvas = createCanvas(1000, 2000);

  // create an engine
  let engine = Matter.Engine.create();
  let world = engine.world;

  // slides and ball
  for (let i = 0; i < 9; i++) {
    // alternate x postion and angle based on whether i is even or odd
    const x = (i % 2 == 0) ? 250 : 650;
    const a = (i % 2 == 0) ? Math.PI * 0.06 : Math.PI * -0.06;
    slides.push(
      new Block(world, { x: x, y: 200 * (i + 1), w: 800, h: 30, color: 'grey' }, { isStatic: true, angle: a })
    );
  }
  ball = new Ball(world, { x: 100, y: 50, r: 40, color: 'white' });

  // add a mouse to manipulate Matter objects
  mouse = new Mouse(engine, canvas, { stroke: 'magenta', strokeWeight: 2 });

  // run the engine
  Matter.Engine.run(engine);
}

function draw() {
  background(0);
  for (let s of slides) {
    s.draw();
  }
  ball.draw();
  mouse.draw();

  // follow the ball by scrolling the window
  scrollFollow(ball);
}

function keyPressed(e) {
  // prevent accidentally scrolling of website with SPACE key
  if(e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
}

function scrollFollow(object) {
  if (insideViewport(object) == false) {
    const $element = $('html, body');
    if ($element.is(':animated') == false) {
      $element.animate({
        scrollLeft: object.body.position.x,
        scrollTop: object.body.position.y
      }, 750);
    }
  }
}

function insideViewport(object) {
  const x = object.body.position.x;
  const y = object.body.position.y;
  const pageXOffset = window.pageXOffset || document.documentElement.scrollLeft;
  const pageYOffset  = window.pageYOffset || document.documentElement.scrollTop;
  if (x >= pageXOffset && x <= pageXOffset + windowWidth &&
      y >= pageYOffset && y <= pageYOffset + windowHeight) {
    return true;
  } else {
    return false;
  }
}
