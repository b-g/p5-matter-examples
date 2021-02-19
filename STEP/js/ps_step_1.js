Homeworks.aufgabe = 1;

function setup() {
  createCanvas(windowWidth, windowHeight)
}

function draw() {
  background(255, 10);
  let c = color(Math.random() * 256, Math.random() * 256, Math.random() * 256);
  fill(c);
  ellipse(Math.random() * windowWidth, Math.random() * windowHeight, 20, 20);
}
