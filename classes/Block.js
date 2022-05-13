/**
Used to create a block (a rectangular box)

@param {world} world - The Matter.js world
@param {object} attributes - Visual properties e.g. position, dimensions and color
@param {object} options - (Optional) Defines the behaviour e.g. mass, bouncyness or whether it can move

@example
const attributes = {
  x: 400,
  y: 500,
  w: 810,
  h: 15,
  color: "grey"
}

const options = {
  isStatic: true,
  angle: PI / 36
}

let box = new Block(world, attributes, options)

@tutorial
<h3>1 - Mouse Example</h3>
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/1-mouse/">Open preview</a>
, 
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/1-mouse/sketch.js">open code</a>
*/

/*

This class allows the block
- to be constrained to other blocks or to the scene itself
- to apply a force from other blocks it collides with
- to rotate around its center via attribute rotate
- trigger an actions from other blocks it collides with

*/

class Block extends BlockCore {
  constructor(world, attributes, options) {
    super(world, attributes, options);
    this.collisions = [];
    this.constraints = [];
    this.offset = this.attributes.offset || { x: 0, y: 0 };
  }

  draw() {
    if (this.body) {
      this.update();
      if (this.attributes.image) {
        this.drawSprite();
      }
      if (this.attributes.color) {
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
      if (block.attributes.force) {
        Matter.Body.applyForce(this.body, this.body.position, block.attributes.force);
      }
      if (block.attributes.trigger) {
        block.attributes.trigger(this, block);
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
    image(this.attributes.image, this.offset.x, this.offset.y);
    pop();
  }

}
