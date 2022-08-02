/**
Creates a new rigid body model with a regular polygon hull based on a list of points.

@param {world} world - The Matter.js world object
@param {object} attributes - Visual properties e.g. position, points and color
@param {object} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move
@extends Block

@example
const points = [
  { x: 0, y: 0 },
  { x: 20, y: 10 },
  { x: 200, y: 30 },
  { x: 220, y: 50 },
  { x: 10, y: 20 }
]

const attributes = {
  x: 600,
  y: 580,
  points: points,
  color: "olive"
}

const options = {
  isStatic: true
}

let polygonBlock = new PolygonFromPoints(world, attributes, options)

@tutorial
XX - Benno Step 7
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/xx-benno-step7/">Open example</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/xx-benno-step7/sketch.js">open code</a>
*/

class PolygonFromPoints extends Block {
  constructor(world, attributes, options) {
    super(world, attributes, options);
  }

  addBody() {
    let shape = Matter.Vertices.create(this.attributes.points, Matter.Body.create({}));
    this.body = Matter.Bodies.fromVertices(0, 0, shape, this.options);
    Matter.Body.setPosition(this.body, this.attributes);
  }
}
