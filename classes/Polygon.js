class Polygon extends Block {
  constructor(world, attrs, options) {
    super(world, attrs, options);
  }

  addBody() {
    this.body = Matter.Bodies.polygon(this.attrs.x, this.attrs.y, this.attrs.s, this.attrs.r, this.options);
  }
}
