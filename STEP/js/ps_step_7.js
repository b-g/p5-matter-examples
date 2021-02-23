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

class Block {

  // attrs sind Eigenschaften von Block und
  // options sind Matter spezifische Eigenschaften
  constructor(attrs, options) {

    this.attrs = attrs
    this.options = options
    this.options.plugin = { block: this, update: this.update }
    this.addBody()
    if (this.body) {
      World.add(engine.world, [this.body])
    }

  }

  addBody() {
    this.body = Bodies.rectangle(this.attrs.x, this.attrs.y, this.attrs.w, this.attrs.h, this.options)
  }

  constrainTo(block) {
    let constraint
    if (block) {
      // an einen anderen Block binden
      constraint = Constraint.create({
        bodyA: this.body,
        bodyB: block.body
      })
    } else {
      // an den Hintergrund binden
      constraint = Constraint.create({
        bodyA: this.body,
        pointB: { x: this.body.position.x, y: this.body.position.y }
      })
    }
    World.add(engine.world, [constraint])
  }

  collide(block) {
    if (this.attrs.force) {
      Body.applyForce(block, block.position, this.attrs.force)
    }
  }

  update() {
    if (this.attrs.chgStatic) {
      Body.setStatic(this.body, false)
    }

    if (this.attrs.rotate) {
      // angle of propeller
      Body.setAngle(this.body, this.attrs.rotate.angle);
      Body.setAngularVelocity(this.body, 0.15);
      this.attrs.rotate.angle += this.attrs.rotate.delta;
    }
  }

  show() {
    this.update()
    fill(this.attrs.color)
    if (this.body) {
      this.drawBody()
    }
  }

  drawBody() {
    if (this.body.parts && this.body.parts.length > 1) {
      this.body.parts.filter((part, i) => i > 0).forEach((part, i) => {
        this.drawVertices(part.vertices)
      })
    } else {
      if (this.body.type == "composite") {
        this.body.bodies.forEach((body, i) => {
          this.drawVertices(body.vertices)
        })
      } else {
        this.drawVertices(this.body.vertices)
      }
    }
  }

  drawVertices(vertices) {
    beginShape()
    vertices.forEach((vert, i) => {
      vertex(vert.x, vert.y)
    })
    endShape(CLOSE)
  }

}

class Ball extends Block {

  // expects x, y, and r in attrs
  constructor(attrs, options) {
    super(attrs, options)
  }

  addBody() {
    this.body = Bodies.circle(this.attrs.x, this.attrs.y, this.attrs.r)
  }

}

class ComplexBlock extends Block {

  constructor(attrs, options) {
    super(attrs, options)
  }

  addBody() {
    this.body = Body.create(this.options)
    Body.setPosition(this.body, this.attrs)
  }

}

class FreehandBlock extends Block {

  constructor(attrs, options) {
    super(attrs, options)
  }

  addBody() {
    let shape = Vertices.create(this.attrs.points, Body.create({}))
    this.body = Bodies.fromVertices(0, 0, shape, this.options)
    Body.setPosition(this.body, this.attrs)
  }

}

class CompositeBlock extends Block {

  constructor(attrs, options) {
    super(attrs, options)
  }

  addBody() {
    this.body = Composites.stack(this.attrs.x, this.attrs.y, this.attrs.cols, this.attrs.rows, this.attrs.colGap, this.attrs.rowGap, this.attrs.create)
  }

}

class SVGBlock extends Block {

  constructor(attrs, options) {
    super(attrs, options)
  }

  addBody() {
    if (this.attrs.elem) {
      // path im SVG in der aktuellen HTML Seite
      let path = document.getElementById(this.attrs.elem)
      if (null != path) {
        this.body = Bodies.fromVertices(0, 0, Vertices.scale(Svg.pathToVertices(path, 10), this.attrs.scale, this.attrs.scale), this.options)
        Body.setPosition(this.body, this.attrs)
      }
    } else {
      // path in separater SVG Datei
      let that = this
      httpGet(this.attrs.file, "text", false, function(response) {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(response, "image/svg+xml");
        const path = svgDoc.querySelector("path");
        that.body = Bodies.fromVertices(0, 0, Vertices.scale(Svg.pathToVertices(path, 10), that.attrs.scale, that.attrs.scale), that.options)
        Body.setPosition(that.body, that.attrs)
        World.add(engine.world, [that.body])
      });
    }
  }

}

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
  blocks.forEach(block => block.show())
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
