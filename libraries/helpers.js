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

  return {
    drawVertices: drawVertices,
    drawBody: drawBody,
  }

}());
