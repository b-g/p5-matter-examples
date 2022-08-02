/**
Creates a chain of blocks, as defined in the attributes.

@param {world} world - The Matter.js world object
@param {object} attributes - Visual properties e.g. position and color
@param {object} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move
@extends Block
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

  /**
   * Adds an constraint to the internal constraints array.
   * @param {constraint} constraint
   * @memberof Chain
   */
  addConstraint(constraint) {
    this.constraints.push(constraint);
  }
}
