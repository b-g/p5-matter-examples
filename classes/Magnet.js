/**
Used to create a magnet. A magnet is a ball that attracts or repels other objects.

@param {world} world - Pass the Matter.js world
@param {object} attributes - Visual properties e.g. position, radius and color
@param {object} options - (Optional) Defines the behaviour e.g. mass, bouncyness or whether it can move
*/

class Magnet extends Ball {

  constructor(world, attributes, options) {
    super(world, attributes, options);
    this.attracted = [];
    this.isActive = this.attributes.attraction;
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
        Matter.Body.applyForce(obj, obj.position, Matter.Vector.mult(force, this.attributes.attraction));
      })
    }
  }
}