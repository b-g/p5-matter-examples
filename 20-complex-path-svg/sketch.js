// Benno Stäbler, Benedikt Groß
// additional dependencies 
// pathseg.js https://github.com/progers/pathseg
// decomp.js https://github.com/schteppe/poly-decomp.js/

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;

let engine;

let ball;
let path;


function preload() {
  httpGet("./path.svg", "text", false, function(response) {
    // when the HTTP request completes ...
    // 1. parse the svg and get the path
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(response, "image/svg+xml");
    const svgPathElement = svgDoc.querySelector("path");
    // 2. setup all matter.js related things
    setupMatter(svgPathElement);
  });
}

function setup() {
  createCanvas(700, 450);
}

function setupMatter(svgPathElement) {
  // use the path from the svg file to create the corresponding matter object
  path = bodyFromPath(svgPathElement, 180, 300, { isStatic: true, friction: 0.0 });

  ball = Bodies.circle(100, 50, 25, {friction: 0.0});
  engine = Engine.create();
  World.add(engine.world, [ball, path]);
  Engine.run(engine);
}

function draw() {
  // do nothing if variable path is empty
  if (!path) return;

  background(0);

  fill(255);
  noStroke();
  drawVertices(ball.vertices);

  strokeWeight(0.5);
  stroke(255);
  drawBody(path);
}

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

function bodyFromPath(path, x, y, options) {
  const body = Matter.Bodies.fromVertices(
    x,
    y,
    Matter.Svg.pathToVertices(path, 10),
    options
  );
  return body;
}
