/**
Creates a stack of stack of blocks. Define block parts via cols, rows, colGap, rowGap and create attributes.

@param {world} world - Pass the Matter.js world
@param {object} attributes - Visual properties e.g. position, radius and color
@param {object} options - (Optional) defines the behaviour e.g. mass, bouncyness or whether it can move
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
<h3>1 - Stacks Example</h3>
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
