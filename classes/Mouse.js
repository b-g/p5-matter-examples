class Mouse {
  constructor(engine, canvas, attrs) {
    this.attrs = attrs || {stroke: "magenta", strokeWeight: 2};

    const mouseOptions = {
      mouse: Matter.Mouse.create(canvas.elt),
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

  draw() {
    push();
    stroke(this.attrs.stroke);
    strokeWeight(this.attrs.strokeWeight);
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
