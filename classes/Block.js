/**
Creates a new rigid body model with a rectangular hull.  <br/>
<br/>
This class allows the block <br/>
- to be constrained to other blocks or to the scene itself <br/>
- to apply a force from other blocks it collides with <br/>
- to rotate around its center via attribute rotate <br/>
- trigger an actions from other blocks it collides with <br/>

@param {Matter.World} world - The Matter.js world
@param {object} attributes - Visual properties e.g. position, dimensions and color
@param {Matter.IChamferableBodyDefinition} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move
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
  /** @type {Matter.Constraint[]} */ constraints;

  /**
   * @param {Matter.World} world
   * @param {object} attributes
   * @param {Matter.IChamferableBodyDefinition} options
   */
  constructor(world, attributes, options) {
    super(world, attributes, options);
    this.collisions = [];
    this.constraints = [];
  }

  draw() {
    if (this.body) {
      this.update();
      if (this.attributes.color || this.attributes.stroke) {
        super.draw();
      }
      if (this.attributes.image) {
        this.drawSprite();
      }
      if (this.constraints.length > 0) {
        for (let c of this.constraints) {
          // TODO: Die Eigenschaft "draw" ist für den Typ "Constraint" nicht vorhanden. ts(2339)
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
    if (constraint.image) {
      push();
      translate(this.body.position.x, this.body.position.y);
      const angle = Math.atan2((posB.y + offsetB.y) - (posA.y + offsetA.y), (posB.x + offsetB.x) - (posA.x + offsetA.x))
      rotate(angle + Math.PI / 2);
      imageMode(CENTER);
      image(constraint.image, this.offset.x, this.offset.y, constraint.image.width * this.attributes.scale, constraint.image.height * this.attributes.scale);
      pop();
    } else {
      line(
        posA.x + offsetA.x,
        posA.y + offsetA.y,
        posB.x + offsetB.x,
        posB.y + offsetB.y
      );
    }
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
   * @param {Block} block
   * @param {Matter.IConstraintDefinition} [options]
   * @return {Matter.Constraint}
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
    const constraint = Matter.Constraint.create(options);
    this.constraints.push(constraint);
    Matter.World.add(this.world, constraint);
    return constraint;
  }

  /**
   * Remove a constraint of this block to another block.
   * @param {Matter.Constraint} constraint
   * @memberof Block
   */
  removeConstraint(constraint) {
    const idx = this.constraints.indexOf(constraint)
    if (idx > -1) {
      this.constraints.splice(idx, 1)
      Matter.World.remove(world, constraint)
    }
  }

  /**
   * Adds a block to an internal collisions array, to check whether this block colides with another block
   * @param {Block} block
   * @memberof Block
   */
  collideWith(block) {
    if (block && !this.collisions.includes(block)) {
      this.collisions.push(block);
    }
  }

  /**
   * Rotates the block to a specific angle (absolute)
   * set the angle of the block to the given angle
   * @param {number} rotation - The angle in radians
   * @param {Matter.Vector} [point] - The point to rotate around
   * @param {boolean} [updateVelocity] - Whether to update the velocity of the block
   * @memberof Block
   * @example
   * // Rotate the block to 45 degrees
   * block.rotate(PI / 4)
   *
   * // Rotate the block to 45 degrees around a specific point
   * block.rotate(PI / 4, { x: 100, y: 100 })
   *
   * // Rotate the block to 45 degrees around a specific point and update the velocity
   * block.rotate(PI / 4, { x: 100, y: 100 }, true)
   *
   * // Rotate the block to 45 degrees around a specific point and update the velocity
   * block.rotate(PI / 4, { x: 100, y: 100 }, true)
   */
  rotate(rotation, point, updateVelocity) {
    const body = this.body;
    if (!point) {
      Matter.Body.setAngle(body, rotation, updateVelocity);
    } else {
      const currentRotation = body.angle;
      const delta = rotation - currentRotation;
      const cos = Math.cos(delta),
        sin = Math.sin(delta),
        dx = body.position.x - point.x,
        dy = body.position.y - point.y;

      Matter.Body.setPosition(body, {
        x: point.x + (dx * cos - dy * sin),
        y: point.y + (dx * sin + dy * cos)
      }, updateVelocity);

      Matter.Body.setAngle(body, rotation, updateVelocity);
    }
  };

  /**
   * Rotates the block by a specific angle (relative)
   * adds the angle to the current angle of the block
   * @param {number} rotation - The angle in radians
   * @param {Matter.Vector} [point] - The point to rotate around
   * @param {boolean} [updateVelocity] - Whether to update the velocity of the block
   * @memberof Block
   * @example
   * // Increments the rotation of the block by 1 degrees
   * block.rotateBy(PI / 180)
   *
   * // Increments the rotation of the block by 1 degrees around a specific point
   * block.rotateBy(PI / 180, { x: 100, y: 100 })
   */
  rotateBy(rotation, point, updateVelocity) {
    const body = this.body;
    if (!point) {
      Matter.Body.setAngle(body, body.angle + rotation, updateVelocity);
    } else {
      const cos = Math.cos(rotation),
        sin = Math.sin(rotation),
        dx = body.position.x - point.x,
        dy = body.position.y - point.y;

      Matter.Body.setPosition(body, {
        x: point.x + (dx * cos - dy * sin),
        y: point.y + (dx * sin + dy * cos)
      }, updateVelocity);

      Matter.Body.setAngle(body, body.angle + rotation, updateVelocity);
    }
  };

  /**
   * Sets the mass centre of the block to a specific offset
   * the offset is relative to the current mass centre
   * @param {Block} block
   * @param {Matter.Vector} offset
   * @memberof Block
   */
  offsetMassCentre(offset) {
    this.body.position.x += offset.x;
    this.body.position.y += offset.y;
    this.body.positionPrev.x += offset.x;
    this.body.positionPrev.y += offset.y;
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
