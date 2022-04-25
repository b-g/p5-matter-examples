/**
Used to create a chain from other objects passed though the attributes property

@param {world} world - The Matter.js world object
@param {object} attributes - Visual properties e.g. position and color
@param {object} options - (Optional) Defines the behaviour e.g. mass, bouncyness or whether it can move

@tutorial
<h3>WIP Bridge</h3>
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/WIP-bridge/">Open example</a>
, 
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/WIP-bridge/sketch.js">open code</a>
*/

class Chain extends Block {
  constructor(world, attributes, options) {
    super(world, attributes, options);
    this.constraints = Matter.Composite.allConstraints(this.composite);
  }

  addBody() {
    this.composite = Matter.Composite.create({ label: "Chain" });
    for (let b of this.attributes.blocks) {
      Matter.Composite.addBody(this.composite, b.body);
    }
    this.body = Matter.Composites.chain(
      this.composite,
      this.attributes.xOffsetA, this.attributes.yOffsetA, this.attributes.xOffsetB, this.attributes.yOffsetB,
      this.options
    );
  }

  addConstraint(constraint) {
    this.constraints.push(constraint);
    //atter.Composite.addConstraint(this.composite, constraint);
  }
}
