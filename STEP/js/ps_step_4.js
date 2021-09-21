Homeworks.aufgabe = 4;

let rand = 400;
let grid = 40;
let field;

class Block {

  constructor(attrs) {
    this.attrs = attrs;
  }

  draw() {
    fill(this.attrs.color);
    rect(rand + this.attrs.pos.x * grid, rand + this.attrs.pos.y * grid, this.attrs.size, this.attrs.size);
  }

}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('thecanvas');
  field = new Block({color: 'green', pos: {x: 0, y: 0}, size: 20});
}

function draw() {
  field.draw();
}
