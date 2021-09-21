class Ball extends Block {

    // expects x, y, and r in attrs
    constructor(attrs, options) {
      super(attrs, options)
    }
  
    addBody() {
      this.body = Bodies.circle(this.attrs.x, this.attrs.y, this.attrs.r)
    }
  
  }  