/*
This class allows the block
- to drawn with various attributes
- to be placed as a rectangle in the world as a physical Matter body 
*/
class BaseBlock {
  // attrs: visual properties of the block e.g. position and dimensions
  // options: definies the behaviour of the block e.g. mass and bouncyness
  constructor(attrs, options) {
    this.attrs = attrs;
    this.options = options;
    this.options.plugin = { block: this };
    this.addBody();
    if (this.body) {
      Matter.World.add(engine.world, [this.body]);
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

/*
This class allows the block
- to be constrained to other blocks or to the scene itself 
- to apply a force from other blocks it collides with
- to rotate around its center via attribute rotate
- trigger an actions from other blocks it collides with
let block = new Block({ x: 640, y: 440, w: 100, h: 5, color: 'white', rotate: { angle: 0, delta: 0.07 } }, { isStatic: true });
*/
class Block extends BaseBlock {
  constructor(attrs, options) {
    super(attrs, options);
    this.collisions = [];
  }

  draw() {
    this.update();
    super.draw();
  }

  update() {
    this.collisions.forEach(block => {
      if (block.attrs.force) {
        Matter.Body.applyForce(this.body, this.body.position, block.attrs.force);
      }
      if (block.attrs.trigger) {
        block.attrs.trigger(this, block);
      }
    });
    this.collisions = [];
    
    
    if (this.attrs.chgStatic) {
      Matter.Body.setStatic(this.body, false);
    }

    if (this.attrs.rotate) {
      // set angle of propeller
      Matter.Body.setAngle(this.body, this.attrs.rotate.angle);
      Matter.Body.setAngularVelocity(this.body, 0.15);
      // increase angle
      this.attrs.rotate.angle += this.attrs.rotate.delta;
    }
  }

  constrainTo(block, options) {
    //options = options | {};
    options.bodyA = this.body;
    let constraint;
    if (block) {
      // constrain to another block
      if (!options.bodyB) {
        options.bodyB = block.body;
      }
      constraint = Matter.Constraint.create(options);
    } else {
      // constrain to scene
      if (!options.pointB) {
        options.pointB = {x:this.body.position.x, y: this.body.position.y};
      }
      constraint = Matter.Constraint.create(options);
    }
    Matter.World.add(engine.world, [constraint]);
  }

  collideWith(block) {
    if (block) {
      this.collisions.push(block);
    }
  }

}