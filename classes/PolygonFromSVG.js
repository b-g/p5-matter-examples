/**
Creates a new rigid body model with a regular polygon hull based on a SVG.
The SVG parameter can either be an external SVG file, or an id of an embedded inline SVG element e.g. in index.html.

@param {Matter.World} world - The Matter.js world object
@param {object} attributes - Visual properties e.g. position, radius and color
@param {Matter.IChamferableBodyDefinition} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move
@extends Block

@example
// SVG via the element id attribute, SVG is embedded in HTML.
const attributes = {
  x: 300,
  y: 500,
  fromId: "puzzle",
  scale: 0.6,
  color: "lime"
}

const options = {
  isStatic: true,
  friction: 0.0
}

let block = new PolygonFromSVG(world, attributes, options);

@example
// SVG via an external SVG file
const attributes = {
  x: 580,
  y: 710,
  fromFile: "./path.svg",
  scale: 0.6,
  color: "yellow"
}

const options = {
  isStatic: true,
  friction: 0.0
}

let block = new PolygonFromSVG(world, attributes, options)

@tutorial
5 - Complex path SVG Example
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/5-complex-path-svg/">Open preview</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/5-complex-path-svg/sketch.js">open code</a>
*/

class PolygonFromSVG extends Block {
  /**
     * @param {Matter.World} world
     * @param {object} attributes
     * @param {Matter.IChamferableBodyDefinition} options
     */
  constructor(world, attributes, options) {
    super(world, attributes, options);
    this.attributes.sample = this.attributes.sample || 10;
  }

  addBody() {
    if (this.attributes.fromVertices) {
      // use list of vertices/points
      this.addBodyVertices(this.attributes.fromVertices)
    } else {
      if (this.attributes.fromPath) {
        // use a path provided directly
        let vertices = Matter.Svg.pathToVertices(this.attributes.fromPath, this.attributes.sample);
        this.addBodyVertices(vertices)
      } else {
        if (this.attributes.fromId) {
          // use a path of SVG embedded in current HTML page
          let path = document.getElementById(this.attributes.fromId);
          if (null != path) {
            let vertices = Matter.Svg.pathToVertices(path, this.attributes.sample);
            this.addBodyVertices(vertices)
          }
        } else {
          // use a path in separate SVG file
          if (this.attributes.sync) {
            const request = new XMLHttpRequest();
            request.open("GET", this.attributes.fromFile, false); // `false` makes the request synchronous
            request.send(null);
            const response = request.responseText;
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(response, "image/svg+xml");
            const path = svgDoc.querySelector("path");
            let vertices = Matter.Svg.pathToVertices(path, this.attributes.sample);
            this.addBodyVertices(vertices)
            Matter.World.add(this.world, [this.body]);
            if (this.attributes.done) {
              this.attributes.done(this, true)
            }
          } else {
            let that = this;
            httpGet(this.attributes.fromFile, "text", false, function (response) {
              const parser = new DOMParser();
              const svgDoc = parser.parseFromString(response, "image/svg+xml");
              const path = svgDoc.querySelector("path");
              let vertices = Matter.Svg.pathToVertices(path, that.attributes.sample);
              that.addBodyVertices(vertices)
              Matter.World.add(that.world, [that.body]);
              if (that.attributes.done) {
                that.attributes.done(that, false)
              }
            });
          }
        }
      }
    }
  }

  addBodyVertices(vertices) {
    // TODO: Das Argument vom Typ "Vector[]" kann dem Parameter vom Typ "Vector[][]" nicht zugewiesen werden. (...) ts(2345)
    // TODO: 4 Argumente wurden erwartet, empfangen wurden aber 3. ts(2554)
    this.body = Matter.Bodies.fromVertices(0, 0, Matter.Vertices.scale(vertices, this.attributes.scale, this.attributes.scale), this.options);
    if (this.body) {
      if (this.attributes.x !== undefined) {
        Matter.Body.setPosition(this.body, this.attributes);
      } else {
        Matter.Body.setPosition(this.body, this.getCenter(vertices));
      }
      if (this.attributes.image) {
        this.offset = {
          x: this.offset.x + (this.attributes.image.width / 2) * this.attributes.scale - (this.body.position.x - this.body.bounds.min.x),
          y: this.offset.y + (this.attributes.image.height / 2) * this.attributes.scale - (this.body.position.y - this.body.bounds.min.y)
        }
      }
    } else {
      console.log('Cound not construct body for path: ', this.attributes.fromPath)
    }
  }

  /**
     * @param {Matter.Vector[]} vertices
     * @returns {Matter.Vector}
     * @memberof PolygonFromSVG
     */
  getCenter(vertices) {
    let min = { x: 999999, y: 999999 };
    let max = { x: -999999, y: -999999 };
    vertices.forEach((v, _) => {
      min.x = min.x > v.x ? v.x : min.x;
      min.y = min.y > v.y ? v.y : min.y;
      max.x = max.x < v.x ? v.x : max.x;
      max.y = max.y < v.y ? v.y : max.y;
    });
    return { x: min.x + (this.body.position.x - this.body.bounds.min.x), y: min.y + (this.body.position.y - this.body.bounds.min.y) }
  }
}
