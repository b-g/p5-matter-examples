/**
Creates a stack of blocks.
Each block is defined via the cols, rows, colGap, rowGap attributes and the create function.

@param {world} world - Pass the Matter.js world
@param {object} attributes - Visual properties e.g. position, radius and color
@param {object} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move
@extends Block

@example
const attributes = {
  x: 550,
  y: 100,
  cols: 10,
  rows: 10,
  colGap: 5,
  rowGap: 5,
  color: "red",
  create: (bx, by) => Bodies.circle(bx, by, 10, { restitution: 0.9 })
}

let block = new CompositeBlock(world, attributes)

@tutorial
1 - Stacks Example
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/1-stacks/">Open example</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/1-stacks/sketch.js">open code</a>
*/

class Stack extends Block {
  constructor(world, attributes, options) {
    super(world, attributes, options);
  }

  addBody() {
    this.body = Matter.Composites.stack(this.attributes.x, this.attributes.y, this.attributes.cols, this.attributes.rows, this.attributes.colGap, this.attributes.rowGap, this.attributes.create);
    for (let body of this.body.bodies) {
      body.plugin = this.options.plugin;
    }
  }
}
