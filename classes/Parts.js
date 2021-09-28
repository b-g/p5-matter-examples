/*
Usage:
// define block parts via parts array option
let block = new ComplexBlock(world, { x: 900, y: 730, color: 'blue' }, { parts: [ Bodies.rectangle(4, 20, 5, 20), Bodies.rectangle(40 - 4, 20, 5, 20), Bodies.rectangle(20, +40 - 4, 50, 5) ], isStatic: true });
*/
class Parts extends Block {
  constructor(world, attrs, options) {
    super(world, attrs, options);
  }

  addBody() {
    this.body = Matter.Body.create(this.options);
    Matter.Body.setPosition(this.body, this.attrs);
  }

}
