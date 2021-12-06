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
    if (this.attrs.fromId) {
      // find SVG embedded in current HTML document
      const $element = document.getElementById(this.attrs.fromId);
      if ($element) {
        this.body = Matter.Bodies.fromVertices(0, 0, Matter.Vertices.scale(Matter.Svg.pathToVertices($element, 10), this.attrs.scale, this.attrs.scale), this.options);
        Matter.Body.setPosition(this.body, this.attrs);
      }
    } else {
      // load external SVG file
      let that = this;
      httpGet(this.attrs.fromFile, "text", false, function(response) {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(response, "image/svg+xml");
        const path = svgDoc.querySelector("path");
        that.body = Matter.Bodies.fromVertices(0, 0, Matter.Vertices.scale(Matter.Svg.pathToVertices(path, 10), that.attrs.scale, that.attrs.scale), that.options);
        Matter.Body.setPosition(that.body, that.attrs);
        Matter.World.add(that.world, that.body);
      });
    }
  }
}
