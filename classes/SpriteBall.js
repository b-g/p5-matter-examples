class SpriteBall extends SpriteBlock {
  constructor(world, attrs, options) {
    super(world, attrs, options);
    this.image = attrs.image;
  }

  addBody() {
    this.body = Matter.Bodies.circle(this.attrs.x, this.attrs.y, this.attrs.r, this.options);
  }
}
