Matter.use('matter-wrap'); // setup wrap coordinates plugin

let ball;
let slide;
let reverseTime = false;
let recordedData = [];

function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  const engine = Matter.Engine.create();
  const world = engine.world;

  // ball
  const wrap = {
      min: { x: 0, y: 0 },
      max: { x: width, y: height }
  };
  ball = new Ball(world,
    { x: 250, y: 50, r: 50, color: 'red' },
    { friction: 0.01, plugin: { wrap: wrap } }
  );

  // slide
  slide = new Block(world,
    { x: 400, y: 300, w: 400, h: 50, color: 'black' },
    { isStatic: true, angle: PI/10 }
  );

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background(210);
  slide.draw();
  ball.draw();
  mouse.draw();
  if(reverseTime){
    drawWhiteBars();
    restoreLastPositionAndDeleteHistory()
  }else{
    recordPosition(ball.body.position, ball.body.angle, ball.body.velocity)
  }
}

function restoreLastPositionAndDeleteHistory(){
  const lastPosition = recordedData.shift()
  if(lastPosition){
    Matter.Body.setPosition(ball.body, lastPosition.p)
    Matter.Body.setAngle(ball.body, lastPosition.a)
    Matter.Body.setVelocity(ball.body, lastPosition.v)
  }else{
    // If we have reached the end of the recorded past we continue with the present
    reverseTime = false
  }
}

function recordPosition(position, angle, velocity){
  // Save the relevant data
  recordedData.unshift({
    p: {
      x: position.x,
      y: position.y,
    },
    a: angle,
    v: {
      x: velocity.x,
      y: velocity.y
    }
  })

  // Remove if we have stored too many
  const maxNumberOfRecordedSteps = 1000;
  while(recordedData.length > maxNumberOfRecordedSteps){
    recordedData.pop()
  }
}

function drawWhiteBars(){
  const barThickness = 20;
  noStroke();
  fill(255);
  rect(0, 0, width, barThickness);
  rect(0, height - barThickness, width, barThickness);
  rect(0, 0, barThickness, height)
  rect(width - barThickness, 0, barThickness, height)
}

function mouseReleased() {
  reverseTime = false;
}

function mousePressed() {
  reverseTime = true;
}
