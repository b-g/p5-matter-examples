// Benno Stäbler, Benedikt Groß
// additional dependencies
// pathseg.js https://github.com/progers/pathseg
// decomp.js https://github.com/schteppe/poly-decomp.js/

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;

const drawBody = Helpers.drawBody;
const bodyFromPath = Helpers.bodyFromPath;

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

  ball = Bodies.circle(100, 50, 40, {friction: 0.0});
  engine = Engine.create();
  World.add(engine.world, [ball, path]);
  Engine.run(engine);
}

function draw() {
  // do nothing if variable path is empty and not yet loaded
  if (!path) return;

  background(0);

  fill(255);
  noStroke();
  drawBody(ball);

  strokeWeight(0.5);
  stroke(255);
  drawBody(path);
}
