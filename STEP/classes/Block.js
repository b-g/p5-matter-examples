class BaseBlock {
  // attrs: visual properties of the block e.g. position and dimensions
  // options: definies the behaviour of the block e.g. mass and bouncyness
  constructor(attrs, options) {
    this.attrs = attrs;
    this.options = options;
    this.options.plugin = { block: this, update: this.update };
    this.addBody();
    if (this.body) {
      World.add(engine.world, [this.body]);
    }
  }

  addBody() {
    this.body = Matter.Bodies.rectangle(this.attrs.x, this.attrs.y, this.attrs.w, this.attrs.h, this.options);
  }

  draw() {
    if (this.body) {
      fill(this.attrs.color);
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

class Block extends BaseBlock {
  constructor(attrs, options) {
    super(attrs, options);
  }

  draw() {
    this.update();
    super.draw();
  }

  update() {
    if (this.attrs.chgStatic) {
      Body.setStatic(this.body, false);
    }

    if (this.attrs.rotate) {
      // angle of propeller
      Body.setAngle(this.body, this.attrs.rotate.angle);
      Body.setAngularVelocity(this.body, 0.15);
      this.attrs.rotate.angle += this.attrs.rotate.delta;
    }
  }

  constrainTo(block) {
    let constraint;
    if (block) {
      // an einen anderen Block binden
      constraint = Constraint.create({
        bodyA: this.body,
        bodyB: block.body
      });
    } else {
      // an den Hintergrund binden
      constraint = Constraint.create({
        bodyA: this.body,
        pointB: { x: this.body.position.x, y: this.body.position.y }
      });
    }
    World.add(engine.world, [constraint]);
  }

  collide(block) {
    if (this.attrs.force) {
      Body.applyForce(block, block.position, this.attrs.force);
    }
  }

}