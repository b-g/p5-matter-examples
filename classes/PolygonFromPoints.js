/*
Usage:
// define block shape via points array attribute
let block = new FreehandBlock(world, { x: 600, y: 580, points: [ { x: 0, y: 0 }, { x: 20, y: 10 }, { x: 200, y: 30 }, { x: 220, y: 50 }, { x: 10, y: 20 } ], color: 'olive' }, { isStatic: true }));
*/
class PolygonFromPoints extends Block {
  constructor(world, attrs, options) {
    super(world, attrs, options);
  }

  addBody() {
    let shape = Matter.Vertices.create(this.attrs.points, Matter.Body.create({}));
    this.body = Matter.Bodies.fromVertices(0, 0, shape, this.options);
    Matter.Body.setPosition(this.body, this.attrs);
  }
}
