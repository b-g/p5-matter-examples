/*
Usage:
// define block parts via cols, rows, colGap, rowGap and create attributes
let block = new CompositeBlock(world, { x: 550, y: 100, cols: 10, rows: 10, colGap: 5, rowGap: 5, color: 'red', create: (bx, by) => Bodies.circle(bx, by, 10, { restitution: 0.9 }) }, {});
*/
class Stack extends Block {
  constructor(world, attrs, options) {
    super(world, attrs, options);
  }

  addBody() {
    this.body = Matter.Composites.stack(this.attrs.x, this.attrs.y, this.attrs.cols, this.attrs.rows, this.attrs.colGap, this.attrs.rowGap, this.attrs.create);
  }
}
