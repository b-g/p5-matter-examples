class Chain extends Block {
  constructor(world, attrs, options) {
    super(world, attrs, options);
    this.constraints = Matter.Composite.allConstraints(this.composite);
  }

  addBody() {
    this.composite = Matter.Composite.create({ label: "Chain" });
    for (let b of this.attrs.blocks) {
      Matter.Composite.addBody(this.composite, b.body);
    }
    this.body = Matter.Composites.chain(
      this.composite,
      this.attrs.xOffsetA, this.attrs.yOffsetA, this.attrs.xOffsetB, this.attrs.yOffsetB,
      this.options
    );
  }

  addConstraint(constraint) {
    Matter.Composite.addConstraint(this.composite, constraint);
  }
}
