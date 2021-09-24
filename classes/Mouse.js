class Mouse {
  constructor(world, engine, canvas, color) {
    this.world = world;
    this.engine = engine;
    this.canvas = canvas;
    this.color = color || "green";

    const mouseOptions = {
      mouse: Matter.Mouse.create(this.canvas.elt),
      constraint: {
        stiffness: 0.05,
        angularStiffness: 0
      }
    }
    this.mouseConstraint = Matter.MouseConstraint.create(this.engine, mouseOptions);
    this.mouseConstraint.mouse.pixelRatio = window.devicePixelRatio;

    Matter.World.add(this.world, this.mouseConstraint);
  }

  draw() {
    stroke(0, 255, 0);
    strokeWeight(2);
    this.drawMouse();
    noStroke();
  }

  drawMouse() {
    if (this.mouseConstraint.body) {
      const pos = this.mouseConstraint.body.position;
      const offset = this.mouseConstraint.constraint.pointB;
      const m = this.mouseConstraint.mouse.position;
      stroke(0, 255, 0);
      strokeWeight(2);
      line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
    }
  }
}
