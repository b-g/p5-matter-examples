/**
Creates a new rigid body model with a rectangular hull.  <br/>
<br/>
This class allows the block <br/>
- to be constrained to other blocks or to the scene itself <br/>
- to apply a force from other blocks it collides with <br/>
- to rotate around its center via attribute rotate <br/>
- trigger an actions from other blocks it collides with <br/>

@param {world} world - The Matter.js world
@param {object} attributes - Visual properties e.g. position, dimensions and color
@param {object} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move
@extends BlockCore

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
1 - Mouse Example
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/1-mouse/">Open preview</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/1-mouse/sketch.js">open code</a>
*/

class Block extends BlockCore {
  constructor(world, attributes, options) {
    super(world, attributes, options);
    this.collisions = [];
    this.constraints = [];
    this.offset = this.attributes.offset || { x: 0, y: 0 };
    this.attributes.scale = this.attributes.scale || 1.0;
  }

  draw() {
    if (this.body) {
      this.update();
      if (this.attributes.color || this.attributes.stroke) {
        super.draw();
      }
      if (this.attributes.image) {
        this.drawSprite();
      }
      if (this.constraints.length > 0) {
        for (let c of this.constraints) {
          if (c.draw === true) this.drawConstraint(c);
        }
      }
    }
  }

  /**
   * Draws the constraints (if any) of the matter body to the p5 canvas
   * @method drawConstraints
   * @memberof Block
   */
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

  /**
   * Constrains this block to another block.
   * Constraints are used for specifying that a fixed distance must be maintained between two blocks (or a block and a fixed world-space position).
   * The stiffness of constraints can be modified via the options to create springs or elastic.
   * @param {block} block
   * @param {object} [options]
   * @return {contraint}
   * @memberof Block
   */
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

  /**
   * Adds a block to an internal collisions array, to check whether this block colides with another block
   * @param {block} block
   * @memberof Block
   */
  collideWith(block) {
    if (block) {
      this.collisions.push(block);
    }
  }

  /**
   * Draw an image "sprite" instead of the shape of the block.
   * Make sure to set attributes.image so that there is an image to draw.
   * @memberof Block
   */
  drawSprite() {
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.attributes.image, this.offset.x, this.offset.y, this.attributes.image.width * this.attributes.scale, this.attributes.image.height * this.attributes.scale);
    pop();
  }

}
