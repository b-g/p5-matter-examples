class Magnet extends Ball {

  constructor(world, attrs, options) {
    super(world, attrs, options);
    this.attracted = [];
    this.isActive = this.attrs.attraction;
  }

  addAttracted(obj) {
    if (obj.length) {
      this.attracted = this.attracted.concat(obj);
    } else  {
      this.attracted.push(obj);
    }
  }

  attract() {
    if (this.isActive) {
      this.attracted.forEach(obj => {
        if (obj.body) {
          obj = obj.body;
        }
        let force = {
          x: (this.body.position.x - obj.position.x),
          y: (this.body.position.y - obj.position.y)
        }
        //Matter.Body.applyForce(ball, ball.position, Matter.Vector.neg(force));
        Matter.Body.applyForce(obj, obj.position, Matter.Vector.mult(force, this.attrs.attraction));
      })
    }
  }
}
