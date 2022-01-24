/*
Usage:
// SVG in separate file path defined via file attribute
let block = new PolygonSpriteFromSVG(world, { x: 580, y: 710, fromFile: './path.svg', scale: 0.6, color: 'yellow', image: mySprite }, { isStatic: true, friction: 0.0 });
*/
class PolygonSpriteFromSVG extends Block {
  constructor(world, attrs, options) {
    super(world, attrs, options);
    this.image = attrs.image;
  }

  addBody() {
    if (this.attrs.elem) {
      // use a path of SVG embedded in current HTML page
      let path = document.getElementById(this.attrs.elem);
      if (null != path) {
        this.body = Matter.Bodies.fromVertices(0, 0, Matter.Vertices.scale(Matter.Svg.pathToVertices(path, 10), this.attrs.scale, this.attrs.scale), this.options);
        Matter.Body.setPosition(this.body, this.attrs);
      }
    } else {
      // use a path in separate SVG file
      let that = this;
      httpGet(this.attrs.file, "text", false, function(response) {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(response, "image/svg+xml");
        const path = svgDoc.querySelector("path");
        that.body = Matter.Bodies.fromVertices(0, 0, Matter.Vertices.scale(Matter.Svg.pathToVertices(path, 10), that.attrs.scale, that.attrs.scale), that.options);
        Matter.Body.setPosition(that.body, that.attrs);
        Matter.World.add(engine.world, [that.body]);
        that.offset = {
          x: that.image.width / 2 - (that.body.position.x - that.body.bounds.min.x),
          y: that.image.height / 2 - (that.body.position.y - that.body.bounds.min.y)}
        //console.log(that.offset)
      });
    }
  }

  draw() {
    this.update();
    this.drawSprite();
    super.draw();
    if (this.constraints.length > 0) {
      for (let c of this.constraints) {
        if (c.draw === true) this.drawConstraint(c);
      }
    }
  }

  drawSprite() {
    const pos = this.body.position;
    //const pos = this.body.bounds.min;
    const angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.image, this.offset.x, this.offset.y);
    pop();
  }
}
