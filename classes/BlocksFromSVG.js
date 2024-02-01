/**
Creates multiple rigid body models based on a SVG-file.
Currently the SVG Elements of rect, circle and path are supported.

This is best be used with a figma sketch, where the shapes are drawn over an backdrop image (room.png) and exported separately
as SVG (furniture.svg) to define the physics relevant parts.
<br> 
<br>The backdrop is used inside the html - a style definition and a div using the style:
<br>.backdrop {
<br>&nbsp;&nbsp;position: absolute;
<br>&nbsp;&nbsp;top: 0;
<br>&nbsp;&nbsp;width: 1600px;
<br>&nbsp;&nbsp;height: 469px;
<br>&nbsp;&nbsp;background-size: cover;
<br>&nbsp;&nbsp;background-image: url('./room.png');
<br>&nbsp;&nbsp;pointer-events: none;
<br>}
<br>
<br>&lt;div class="backdrop"&gt;

@param {Matter.World} world - The Matter.js world
@param {string} file - Path or URL to a SVG-file with multiple SVG Elements of type rect, circle or path
@param {Block[]} blocks - All created blocks will be added to this array
@param {Matter.IChamferableBodyDefinition} [options] - Defines the common behaviour of all created blocks e.g. mass, bouncyness or whether it can move

@example
// Adding the furniture and accessories to the blocks array and into the matter world with coordinates perfectly matching the backdrop image.
new BlocksFromSVG(world, "furniture.svg", blocks, {
  isStatic: true, restitution: 0.0
})

@tutorial
5 - SVG with multiple shapes
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/5-svg-with-multiple-shapes/">Open preview</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/5-svg-with-multiple-shapes/sketch.js">open code</a>
*/

class BlocksFromSVG {
  /**
   * @param {Matter.World} world
   * @param {string} file
   * @param {Block[]} blocks
   * @param {Matter.IChamferableBodyDefinition} options
   */
  constructor(world, file, blocks, options, save) {
    this.blocks = blocks;
    this.world = world;
    this.options = options || {};
    this.options.sample = this.options.sample || 10;
    let that = this;
    this.beg = new Date();
    this.save = save
    this.file = file
    this.data = { rect: [], circle: [], path: [] }
    const saved = localStorage.getItem(this.file)
    if (this.save && saved) {
      let block;
      const data = JSON.parse(saved)
      data.rect.forEach(r => {
        block = new Block(
          this.world,
          r.attrs,
          r.options
        );
        if (r.options.angle) {
          Matter.Body.translate(block.body, {
            x: r.attrs.height * Math.sin(-r.options.angle) + r.attrs.width * Math.sin(1 - r.options.angle),
            y: r.attrs.height * Math.sin(r.options.angle) + r.attrs.width * Math.sin(1 - r.options.angle),
          });
        }
        this.blocks.push(block);
      })
      data.circle.forEach(c => {
        block = new Ball(
          this.world,
          c.attrs,
          c.options
        );
        if (c.options.angle) {
          Matter.Body.translate(block.body, {
            x:
              c.attrs.height * Math.sin(-c.options.angle) +
              c.attrs.width * Math.sin(1 - c.options.angle),
            y:
              c.attrs.height * Math.sin(c.options.angle) +
              c.attrs.width * Math.sin(1 - c.options.angle),
          });
        }
        this.blocks.push(block);
      })
      data.path.forEach(p => {
        block = new PolygonFromSVG(
          this.world,
          p.attrs,
          p.options
        );
        this.blocks.push(block);
      })
      console.log("DONE", new Date() - that.beg);
    } else {
      localStorage.removeItem(file);
      this.promise = httpGet(file, "text", false, (response) => {
        console.log("LOAD", new Date() - that.beg);
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(response, "image/svg+xml");
        that.createBlocks("rect", svgDoc.getElementsByTagName("rect"));
        that.createBlocks("circle", svgDoc.getElementsByTagName("circle"));
        that.createBlocks("path", svgDoc.getElementsByTagName("path"));
        if (that.save) {
          localStorage.setItem(that.file, JSON.stringify(that.data))
        }
        console.log("DONE", new Date() - that.beg);
      });
    }
  }

  createBlocks(type, list) {
    let block
    for (let r = 0; r < list.length; r++) {
      let options = {
        ...this.options
      }
      let attributes = this.attributes2object(list[r])
      if (attributes.transform) {
        this.trans = attributes.transform.split(/[ \(\)]/)
        if (this.trans[0] == 'rotate') {
          // options.angle = radians(trans[1]);
          this.pts = this.rotate(attributes.x || 0, attributes.y || 0, attributes.width, attributes.height, +this.trans[1])
          this.center = this.rotatePoint((attributes.x || 0) + attributes.width / 2, (attributes.y || 0) + attributes.height / 2, attributes.x || 0, attributes.y || 0, +this.trans[1])
        } else if (this.trans[0] == 'matrix') {
          this.pts = this.matrix(attributes.x || 0, attributes.y || 0, attributes.width, attributes.height, +this.trans[1], +this.trans[2], +this.trans[3], +this.trans[4], +this.trans[5], +this.trans[6])
          this.center = this.matrixPoint((attributes.x || 0) + attributes.width / 2, (attributes.y || 0) + attributes.height / 2, +this.trans[1], +this.trans[2], +this.trans[3], +this.trans[4], +this.trans[5], +this.trans[6])
        }
      }
      if (type == 'rect') {
        if (this.pts) {
          // console.log(this.center, this.pts)
          block = new PolygonFromPoints(
            this.world, {
            x: this.center.x,
            y: this.center.y,
            scale: 1.0,
            points: this.pts,
            color: attributes.fill,
            stroke: attributes.stroke
          },
            options
          );
        } else {
          block = new Block(
            this.world, {
            x: (attributes.x || 0) + attributes.width / 2,
            y: (attributes.y || 0) + attributes.height / 2,
            w: attributes.width,
            h: attributes.height,
            color: attributes.fill,
            stroke: attributes.stroke
          },
            options
          );
          if (options.angle) {
            Matter.Body.translate(block.body, {
              x: attributes.height * Math.sin(-options.angle) + attributes.width * Math.sin(1 - options.angle),
              y: attributes.height * Math.sin(options.angle) + attributes.width * Math.sin(1 - options.angle)
            });
          }
        }
      } else {
        if (type == 'circle') {
          block = new Ball(
            this.world, {
            x: attributes.cx,
            y: attributes.cy,
            r: attributes.r,
            color: attributes.fill,
            stroke: attributes.stroke
          },
            options
          );
          if (options.angle) {
            Matter.Body.translate(block.body, {
              x: attributes.height * Math.sin(-options.angle) + attributes.width * Math.sin(1 - options.angle),
              y: attributes.height * Math.sin(options.angle) + attributes.width * Math.sin(1 - options.angle)
            });
          }
        } else {
          if (type == 'path') {
            const attrs = {
              scale: 1.0,
              fromVertices: Matter.Svg.pathToVertices(list[r], this.options.sample),
              color: attributes.fill,
              stroke: attributes.stroke,
              sample: this.options.sample
          }
            block = new PolygonFromSVG(
              this.world,
              attrs,
              options
            );
            if (this.save) {
              delete options.plugin.block
              this.data.path.push({ attrs: attrs, options: options })
            }
          }
        }
      }
      this.blocks.push(block);
    }
  }

  matrix(x, y, w, h, a, b, c, d, e, f) {
    let pts = [
      // top left corner
      this.matrixPoint(x, y, a, b, c, d, e, f),
      // top right corner
      this.matrixPoint(x + w, y, a, b, c, d, e, f),
      // bottom right corner
      this.matrixPoint(x + w, y + h, a, b, c, d, e, f),
      // bottom left corner
      this.matrixPoint(x, y + h, a, b, c, d, e, f),
    ]
    return pts
  }

  matrixPoint(x, y, a, b, c, d, e, f) {
    return { x: Math.round(a * x + c * y + e), y: Math.round(b * x + d * y + f) }
  }

  rotate(x, y, w, h, a) {
    console.log(x, y, w, h, a)
    let cx = x,
      cy = y
    let pts = [
      // top left corner
      this.rotatePoint(x, y, cx, cy, a),
      // top right corner
      this.rotatePoint((x + w), y, cx, cy, a),
      // bottom right corner
      this.rotatePoint((x + w), (y + h), cx, cy, a),
      // bottom left corner
      this.rotatePoint(x, (y + h), cx, cy, a)
    ]
    return pts
  }

  rotatePoint(x, y, cx, cy, a) {
    var cos = Math.cos(-radians(a)),
      sin = Math.sin(-radians(a)),
      nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
      ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return { x: Math.round(nx), y: Math.round(ny) };
  }

  attributes2object(elem) {
    let o = {}
    for (let a = 0; a < elem.attributes.length; a++) {
      let attribute = elem.attributes[a]
      if (isNaN(+attribute.nodeValue)) {
        o[attribute.nodeName] = attribute.nodeValue;
      } else {
        o[attribute.nodeName] = +attribute.nodeValue;
      }
    }
    return o
  }
}
