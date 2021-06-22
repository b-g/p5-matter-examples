const Helpers = (function() {

  function drawVertices(vertices) {
    beginShape();
    for (let i = 0; i < vertices.length; i++) {
      vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
  }

  function drawBody(body) {
    if (body.parts && body.parts.length > 1) {
      for (let p = 1; p < body.parts.length; p++) {
        drawVertices(body.parts[p].vertices)
      }
    } else {
      drawVertices(body.vertices);
    }
  }

  function drawBodies(bodies) {
    for (let i = 0; i < bodies.length; i++) {
      drawBody(bodies[i]);
    }
  }

  function drawMouse(mouseConstraint) {
    if (mouseConstraint.body) {
      const pos = mouseConstraint.body.position;
      const offset = mouseConstraint.constraint.pointB;
      const m = mouseConstraint.mouse.position;
      stroke(0, 255, 0);
      strokeWeight(2);
      line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
    }
  }

  function drawConstraint(constraint) {
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

  function drawConstraints(constraints) {
    for (let i = 0; i < constraints.length; i++) {
      drawConstraint(constraints[i]);
    }
  }

  function drawSprite(body, img) {
    const pos = body.position;
    const angle = body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(img, 0, 0);
    pop();
  }

  function drawText(body, txt) {
    const pos = body.position;
    const angle = body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    textAlign(CENTER, CENTER);
    text(txt, 0, 0);
    ellipse(0, 10, 2, 2);
    pop();
  }

  function bodyFromPath(path, x, y, options) {
    const body = Matter.Bodies.fromVertices(
      x,
      y,
      Matter.Svg.pathToVertices(path, 10),
      options
    );
    return body;
  }

  return {
    drawVertices: drawVertices,
    drawBody: drawBody,
    drawBodies: drawBodies,
    drawMouse: drawMouse,
    drawConstraint: drawConstraint,
    drawConstraints: drawConstraints,
    drawSprite: drawSprite,
    drawText: drawText,
    bodyFromPath: bodyFromPath,
  }

}());
