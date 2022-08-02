/**
Creates a new rigid body model with a regular polygon hull with the given number of sides and radius.

@param {world} world - The Matter.js world object
@param {object} attributes - Visual properties e.g. position, radius and color
@param {object} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move
@extends Block

@example
let polygon = new Polygon(world, {x: 300, y: 200, s: 5, r: 100, color: 'white'})

@tutorial
3 - Constraints Example
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/3-constraints/">Open example</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/3-constraints/sketch.js">open code</a>
*/

class Polygon extends Block {
  constructor(world, attributes, options) {
    super(world, attributes, options);
  }

  addBody() {
    this.body = Matter.Bodies.polygon(this.attributes.x, this.attributes.y, this.attributes.s, this.attributes.r, this.options);
  }
}
