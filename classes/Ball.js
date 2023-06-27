/**
Creates a new rigid body model with a circle hull.

@param {Matter.World} world - The Matter.js world object
@param {object} attributes - Visual properties e.g. position, radius and color
@param {Matter.IBodyDefinition} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move
@extends Block

@example
const attributes = {
  x: 300,
  y: 300,
  r: 30,
  color: "magenta",
}

const options = {
  isStatic: true,
}

let magentaColoredBall = new Ball(world, attributes, options)

@tutorial
1 - Mouse Example
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/1-mouse/">Open preview</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/1-mouse/sketch.js">open code</a>

@tutorial
4 - Jumping Ball Example
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/4-jumping-ball/">Open preview</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/4-jumping-ball/sketch.js">open code</a>
*/

class Ball extends Block {
  /**
   * @param {Matter.World} world 
   * @param {object} attributes 
   * @param {Matter.IChamferableBodyDefinition} options 
   */
  constructor(world, attributes, options) {
    super(world, attributes, options);
  }

  addBody() {
    // TODO: Matter.IChamferableBodyDefinition (Matter.rectangle) <==> Matter.IBodyDefinition (Matter.circle)?
    this.body = Matter.Bodies.circle(this.attributes.x, this.attributes.y, this.attributes.r, this.options);
  }
}
