Homeworks.aufgabe = 7;

const Engine = Matter.Engine
const Render = Matter.Render
const World = Matter.World
const Bodies = Matter.Bodies
const Body = Matter.Body
const Vertices = Matter.Vertices
const Svg = Matter.Svg
const Composites = Matter.Composites

let engine
let blocks = []

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight)
  canvas.parent('thecanvas')

  engine = Engine.create()

  // create some blocks
  blocks.push(new Block({ x: 200, y: 200, w: 60, h: 60, color: 'blue' }, { isStatic: false }))
  blocks.push(new Block({ x: windowWidth / 2, y: 800, w: windowWidth, h: 10, color: 'gray' }, { isStatic: true }))
  blocks.push(new Ball({ x: 300, y: 300, r: 30, color: 'magenta' }, { isStatic: true }))

  // Propeller
  blocks.push(new Block({ x: 640, y: 440, w: 100, h: 5, color: 'white', rotate: { angle: 0, delta: 0.07 } }, { isStatic: true }))

  // create a body from multiple parts
  blocks.push(new ComplexBlock({ x: 900, y: 730, color: 'blue' }, {
    parts: [
      Bodies.rectangle(4, 20, 5, 20),
      Bodies.rectangle(40 - 4, 20, 5, 20),
      Bodies.rectangle(20, +40 - 4, 50, 5)
    ],
    isStatic: true,
    friction: 0.0
  }))

  // create a body from points
  blocks.push(new FreehandBlock({
    x: 600,
    y: 580,
    points: [
      { x: 0, y: 0 }, { x: 20, y: 10 }, { x: 200, y: 30 }, { x: 220, y: 50 }, { x: 10, y: 20 }
    ],
    color: 'olive'
  }, { isStatic: true }))

  // create a body from a SVG path
  blocks.push(new SVGBlock({ x: 300, y: 500, elem: 'puzzle', scale: 0.6, color: 'lime' }, { isStatic: true, friction: 0.0 }))
  blocks.push(new SVGBlock({ x: 580, y: 710, file: './path.svg', scale: 0.6, color: 'yellow' }, { isStatic: true, friction: 0.0 }))

  // create a group of identical bodies
  blocks.push(new CompositeBlock({
    x: 550,
    y: 100,
    cols: 10,
    rows: 10,
    colGap: 5,
    rowGap: 5,
    color: 'red',
    create: (bx, by) => Bodies.circle(bx, by, 10, { restitution: 0.9 })
  }, {}))

  // run the engine
  Engine.run(engine);
}

function draw() {
  background(0, 20)
  noStroke()
  blocks.forEach(block => block.draw())
}

function drawMouse(mouseConstraint) {
  if (mouseConstraint.body) {
    let pos = mouseConstraint.body.position
    let offset = mouseConstraint.constraint.pointB
    let m = mouseConstraint.mouse.position
    stroke(0, 255, 0)
    strokeWeight(2)
    line(pos.x + offset.x, pos.y + offset.y, m.x, m.y)
  }
}

function drawConstraint(constraint) {
  let posA = { x: 0, y: 0 }
  if (constraint.bodyA) {
    posA = constraint.bodyA.position
  }
  let posB = { x: 0, y: 0 }
  if (constraint.bodyB) {
    posB = constraint.bodyB.position
  }
  line(
    posA.x + constraint.pointA.x,
    posA.y + constraint.pointA.y,
    posB.x + constraint.pointB.x,
    posB.y + constraint.pointB.y
  )
}
