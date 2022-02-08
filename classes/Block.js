/*
This class allows the block
- to be constrained to other blocks or to the scene itself
- to apply a force from other blocks it collides with
- to rotate around its center via attribute rotate
- trigger an actions from other blocks it collides with
let block = new Block(world, { x: 400, y: 500, w: 810, h: 15, color: 'grey' }, { isStatic: true, angle: PI/36 })
*/
class Block extends BlockCore {
  constructor(world, attrs, options) {
    super(world, attrs, options);
    this.collisions = [];
    this.constraints = [];
    this.offset = this.attrs.offset || { x: 0, y: 0 };
  }

  draw() {
    if (this.body) {
      this.update();
      if (this.attrs.image) {
        this.drawSprite();
      }
      if (this.attrs.color) {
        super.draw();
      }
      if (this.constraints.length > 0) {
        for (let c of this.constraints) {
          if (c.draw === true) this.drawConstraint(c);
        }
      }
    }
  }

  drawConstraints() {
    if (this.constraints.length > 0) {
      for (let c of this.constraints) {
        this.drawConstraint(c);
      }
    }
  }

  drawConstraint(constraint) {
    if (constraint.color) {
      stroke(constraint.color);
    } else {
      stroke("magenta");
    }
    strokeWeight(2);
    const offsetA = constraint.pointA;
    let posA = {
      x: 0,
      y: 0
    };
    if (constraint.bodyA) {
      posA = constraint.bodyA.position;
    }
    const offsetB = constraint.pointB;
    let posB = {
      x: 0,
      y: 0
    };
    if (constraint.bodyB) {
      posB = constraint.bodyB.position;
    }
    line(
      posA.x + offsetA.x,
      posA.y + offsetA.y,
      posB.x + offsetB.x,
      posB.y + offsetB.y
    );
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
  }

  constrainTo(block, options) {
    options.bodyA = this.body;
    if (block) {
      // constrain to another block
      if (!options.bodyB) {
        options.bodyB = block.body;
      }
    } else {
      // constrain to "background" scene
      if (!options.pointB) {
        options.pointB = {
          x: this.body.position.x,
          y: this.body.position.y
        };
      }
    }
    const contraint = Matter.Constraint.create(options);
    this.constraints.push(contraint);
    Matter.World.add(this.world, contraint);
    return contraint;
  }

  collideWith(block) {
    if (block) {
      this.collisions.push(block);
    }
  }

  drawSprite() {
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.attrs.image, this.offset.x, this.offset.y);
    pop();
  }

}
