/*
Usage:
// define ball radius via r attribute
let block = new Ball({ x: 300, y: 300, r: 30, color: 'magenta' }, { isStatic: true });
*/
class Ball extends Block {

    constructor(attrs, options) {
      super(attrs, options)
    }
  
    addBody() {
      this.body = Matter.Bodies.circle(this.attrs.x, this.attrs.y, this.attrs.r, this.options)
    }
  
  }  