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