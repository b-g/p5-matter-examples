/*
Usage:
// SVG embedded in HTML path defined via elem attribute
let block = new SVGBlock(world, { x: 300, y: 500, elem: 'puzzle', scale: 0.6, color: 'lime' }, { isStatic: true, friction: 0.0 });
// SVG in separate file path defined via file attribute
let block = new SVGBlock(world, { x: 580, y: 710, file: './path.svg', scale: 0.6, color: 'yellow' }, { isStatic: true, friction: 0.0 });
*/
class PolygonFromSVG extends Block {
  constructor(world, attrs, options) {
    super(world, attrs, options);
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
      });
    }
  }
}
