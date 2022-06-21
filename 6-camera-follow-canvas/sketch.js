let ball;
let slides = [];


function setup() {
  const canvas = createCanvas(800, 600);

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

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  const zoom = map(mouseX, 0, width, 0.5, 2)
  const shiftX = -ball.body.position.x * zoom + width / 2;
  const shiftY = -ball.body.position.y * zoom + height / 2;
  

  console.log(shiftX, shiftY)

  push()
  translate(shiftX, shiftY)
  scale(zoom)
  background(0);
  for (let s of slides) {
    s.draw();
  }
  ball.draw();
  pop()
}
