/**
Used to add mouse interaction with physics objects.

@param {engine} world - Pass the Matter.js engine
@param {canvas} canvas - Pass the drawing canvas
@param {object} attributes - (Optional) Attributes like color

@example
let mouse = new Mouse(engine, canvas, { stroke: 'blue', strokeWeight: 3 })

@tutorial
<h3>1 - Mouse Example</h3>
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

  on(event, action) {
    Matter.Events.on(this.mouseConstraint, event, action);
  }

  setOffset(offset) {
    Matter.Mouse.setOffset(this.mouse, offset)
  }

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
