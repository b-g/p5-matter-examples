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
    this.constraint = undefined;
  }

  draw() {
    this.update();
    super.draw();
  }

  drawConstraint() {
    if (this.constraint) {
      stroke("magenta");
      strokeWeight(2);

      const offsetA = this.constraint.pointA;
      let posA = {
        x: 0,
        y: 0
      };
      if (this.constraint.bodyA) {
        posA = this.constraint.bodyA.position;
      }
      const offsetB = this.constraint.pointB;
      let posB = {
        x: 0,
        y: 0
      };
      if (this.constraint.bodyB) {
        posB = this.constraint.bodyB.position;
      }
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
    options.bodyA = this.body;
    if (block) {
      // constrain to another block
      if (!options.bodyB) {
        options.bodyB = block.body;
      }
      this.constraint = Matter.Constraint.create(options);
    } else {
      // constrain to scene
      if (!options.pointB) {
        options.pointB = {x:this.body.position.x, y: this.body.position.y};
      }
      this.constraint = Matter.Constraint.create(options);
    }
    Matter.World.add(this.world, this.constraint);
  }

  collideWith(block) {
    if (block) {
      this.collisions.push(block);
    }
  }

}
