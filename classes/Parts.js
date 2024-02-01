/**
Creates Parts (group of bodies) as defined by the required options.parts.

@param {world} world - The Matter.js world object
@param {object} attributes - Visual properties e.g. position and color
@param {object} options - (Required) Defines the behaviour e.g. mass, bouncyness or whether it can move
@extends Block

@example
const parts = [
  Bodies.rectangle(4, 20, 5, 20),
  Bodies.rectangle(40 - 4, 20, 5, 20),
  Bodies.rectangle(20, +40 - 4, 50, 5)
]

const attributes = {
  x: 900,
  y: 730,
  color: "blue"
}

const options = {
  parts: parts,
  isStatic: true
}

let blockFromParts = new Parts(world, attributes, options)
*/

class Parts extends Block {
  constructor(world, attributes, options) {
    super(world, attributes, options);
  }

  addBody() {
    this.body = Matter.Body.create(this.options);
    Matter.Body.setPosition(this.body, this.attributes);
if (this.options.angle) {
      Matter.Body.setAngle(this.body, this.options.angle);
    }
  }
}
