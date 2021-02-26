class Block {
  // attrs: visual properties of the block e.g. position and dimensions
  // options: definies the behaviour of the block e.g. mass and bouncyness
  constructor(attrs, options) {
    this.attrs = attrs;
    this.options = options;
    this.options.plugin = { block: this, update: this.update };
    this.addBody();
    Matter.World.add(engine.world, this.body);
  }

  addBody() {
    this.body = Matter.Bodies.rectangle(this.attrs.x, this.attrs.y, this.attrs.w, this.attrs.h, this.options);
  }

  draw() {
    fill(this.attrs.color);
    this.drawBody();
  }

  drawBody() {
    if (this.body.parts && this.body.parts.length > 1) {
      // skip index 0
      for (const p = 1; p < this.body.parts.length; p++) {
        drawVertices(this.body.parts[p].vertices);
      }
    } else {
      if (this.body.type == "composite") {
        for (const body of this.body.bodies) {
          this.drawVertices(body.vertices);
        }
      } else {
        this.drawVertices(this.body.vertices);
      }
    }
  }

  drawVertices(vertices) {
    beginShape();
    for (const vertice of vertices) {
      vertex(vertice.x, vertice.y);
    }
    endShape(CLOSE);
  }

}
