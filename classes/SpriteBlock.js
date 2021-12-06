class SpriteBlock extends Block {
  constructor(world, attrs, options) {
    super(world, attrs, options);
    this.image = attrs.image;
  }

  addBody() {
    this.body = Matter.Bodies.rectangle(this.attrs.x, this.attrs.y, this.attrs.w, this.attrs.h, this.options);
  }

  draw() {
    this.update();
    this.drawSprite();
    if (this.constraints.length > 0) {
      for (let c of this.constraints) {
        if (c.draw === true) this.drawConstraint(c);
      }
    }
  }

  drawSprite() {
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.image, 0, 0);
    pop();
  }
}
