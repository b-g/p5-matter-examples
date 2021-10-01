/*
This class allows the block
- to drawn with various attributes
- to be placed as a rectangle in the world as a physical Matter body
*/
class BlockCore {
  // attrs: visual properties of the block e.g. position and dimensions
  // options: definies the behaviour of the block e.g. mass and bouncyness
  constructor(world, attrs, options) {
    this.world = world;
    this.attrs = attrs;
    this.options = options || {};
    this.options.plugin = this.options.plugin || {};
    this.options.plugin.block = this;
    this.addBody();
    if (this.body) {
      Matter.World.add(this.world, this.body);
    }
  }

  addBody() {
    this.body = Matter.Bodies.rectangle(this.attrs.x, this.attrs.y, this.attrs.w, this.attrs.h, this.options);
  }

  draw() {
    if (this.body) {
      fill(this.attrs.color);
      noStroke();
      this.drawBody();
    }
  }

  drawBody() {
    if (this.body.parts && this.body.parts.length > 1) {
      // skip index 0
      for (let p = 1; p < this.body.parts.length; p++) {
        this.drawVertices(this.body.parts[p].vertices);
      }
    } else {
      if (this.body.type == "composite") {
        for (let body of this.body.bodies) {
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
