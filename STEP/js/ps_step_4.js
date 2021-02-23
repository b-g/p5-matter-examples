Homeworks.aufgabe = 4;

let rand = 400
let grid = 40
let field

class Field {

  constructor(attrs) {
    this.attrs = attrs
  }

  show() {
    fill(this.attrs.color)
    rect(rand + this.attrs.pos.x * grid, rand + this.attrs.pos.y * grid, this.attrs.size, this.attrs.size);
  }

}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight)
  canvas.parent('thecanvas')
  field = new Field({color: 'green', pos: {x: 0, y: 0}, size: 20})
}

function draw() {
  field.show()
}
