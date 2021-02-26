const Helpers = (function() {

  function drawVertices(vertices) {
    beginShape();
    for (const vertice of vertices) {
      vertex(vertice.x, vertice.y);
    }
    endShape(CLOSE);
  }

  function drawBody(body) {
    if (body.parts && body.parts.length > 1) {
      // skip index 0
      for (const p = 1; p < body.parts.length; p++) {
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
