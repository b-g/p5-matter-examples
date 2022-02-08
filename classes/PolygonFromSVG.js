/*
Usage:
// SVG embedded in HTML path defined via elem attribute
let block = new PolygonFromSVG(world, { x: 300, y: 500, fromId: 'puzzle', scale: 0.6, color: 'lime' }, { isStatic: true, friction: 0.0 });
// SVG in separate file path defined via file attribute
let block = new PolygonFromSVG(world, { x: 580, y: 710, fromFile: './path.svg', scale: 0.6, color: 'yellow' }, { isStatic: true, friction: 0.0 });
*/
class PolygonFromSVG extends Block {
  constructor(world, attrs, options) {
    super(world, attrs, options);
  }

  addBody() {
    if (this.attrs.fromPath) {
        // use a path provided directly
        let vertices = Matter.Svg.pathToVertices(this.attrs.fromPath, 10);
        this.addBodyVertices(vertices)
    } else {
      if (this.attrs.fromId) {
        // use a path of SVG embedded in current HTML page
        let path = document.getElementById(this.attrs.fromId);
        if (null != path) {
          let vertices = Matter.Svg.pathToVertices(path, 10);
          this.addBodyVertices(vertices)
        }
      } else {
        // use a path in separate SVG file
        let that = this;
        httpGet(this.attrs.fromFile, "text", false, function(response) {
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(response, "image/svg+xml");
          const path = svgDoc.querySelector("path");
          let vertices = Matter.Svg.pathToVertices(path, 10);
          that.addBodyVertices(vertices)
          Matter.World.add(that.world, [that.body]);
        });
      }
    }
  }

  addBodyVertices(vertices) {
    this.body = Matter.Bodies.fromVertices(0, 0, Matter.Vertices.scale(vertices, this.attrs.scale, this.attrs.scale), this.options);
    if (this.attrs.x) {
      Matter.Body.setPosition(this.body, this.attrs);
    } else {
      Matter.Body.setPosition(this.body, this.getCenter(vertices));
    }
    if (this.attrs.image) {
      this.offset = {
        x: this.attrs.image.width / 2 - (this.body.position.x - this.body.bounds.min.x),
        y: this.attrs.image.height / 2 - (this.body.position.y - this.body.bounds.min.y)
      }
    }
  }

  getCenter(vertices) {
    let min = {x: 999999, y: 999999};
    let max = {x: -999999, y: -999999};
    vertices.forEach((v, i) => {
      min.x = min.x > v.x ? v.x : min.x;
      min.y = min.y > v.y ? v.y : min.y;
      max.x = max.x < v.x ? v.x : max.x;
      max.y = max.y < v.y ? v.y : max.y;
    });
    return { x: min.x + (this.body.position.x - this.body.bounds.min.x), y: min.y + (this.body.position.y - this.body.bounds.min.y) }
  }
}
