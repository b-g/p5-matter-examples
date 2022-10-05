/**
Creates a representation of the user's mouse for being able to interact with the Matter.js world.

@param {engine} world - Pass the Matter.js engine
@param {canvas} canvas - Pass the drawing canvas
@param {object} attributes - (Optional) Attributes like color

@example
let mouse = new Mouse(engine, canvas, { stroke: 'blue', strokeWeight: 3 })

@tutorial
1 - Mouse Example
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/1-mouse/">Open preview</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/1-mouse/sketch.js">open code</a>
*/

class Mouse {
  constructor(engine, canvas, attributes) {
    this.attributes = attributes || {stroke: "magenta", strokeWeight: 2};
    this.mouse = Matter.Mouse.create(canvas.elt);
    const mouseOptions = {
      mouse: this.mouse,
      constraint: {
        stiffness: 0.05,
        angularStiffness: 0
      }
    }
    this.mouseConstraint = Matter.MouseConstraint.create(engine, mouseOptions);
    this.mouseConstraint.mouse.pixelRatio = window.devicePixelRatio;

    Matter.World.add(engine.world, this.mouseConstraint);
  }

  /**
   * Subscribes a callback function to the given object's eventName
   * @param {string} eventName
   * @param {function} action
   * @memberof Mouse
   */
  on(eventName, action) {
    Matter.Events.on(this.mouseConstraint, eventName, action);
  }

  /**
   * Sets the mouse position offset e.g. { x: 0, y: 0 }
   * @param {object} offset
   * @memberof Mouse
   */
  setOffset(offset) {
    Matter.Mouse.setOffset(this.mouse, offset)
  }

  /**
   * Draws the mouse constraints to the p5 canvas
   * @memberof Mouse
   */
  draw() {
    push();
    stroke(this.attributes.stroke);
    strokeWeight(this.attributes.strokeWeight);
    this.drawMouse();
    pop();
  }

  drawMouse() {
    if (this.mouseConstraint.body) {
      const pos = this.mouseConstraint.body.position;
      const offset = this.mouseConstraint.constraint.pointB;
      const m = this.mouseConstraint.mouse.position;
      line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
    }
  }
}
