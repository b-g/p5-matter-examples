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
  constructor(world, file, blocks, options, config) {
    this.blocks = blocks;
    this.added = {}
    this.world = world;
    this.options = options || {};
    this.config = config || {}
    this.config.sample = this.config.sample || 10;
    this.config.offset = this.config.offset || { x: 0, y: 0 };
    let that = this;
    this.beg = new Date();
    this.file = file
    this.data = { rect: [], circle: [], path: [] }
    const saved = localStorage.getItem(this.file)
    if (this.config.save && saved) {
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
        if (r.attrs.id) {
          this.added[r.attrs.id] = block
        }
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
        if (c.attrs.id) {
          this.added[c.attrs.id] = block
        }
      })
      data.path.forEach(p => {
        block = new PolygonFromSVG(
          this.world,
          p.attrs,
          p.options
        );
        this.blocks.push(block);
        if (p.attrs.id) {
          this.added[p.attrs.id] = block
        }
      })
      if (this.config.done) {
        this.config.done(this.added, new Date() - that.beg, true)
      }
    } else {
      localStorage.removeItem(file);
      this.promise = httpGet(file, "text", false, (response) => {
        console.log("LOAD", new Date() - that.beg);
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(response, "image/svg+xml");
        that.createBlocks("rect", svgDoc.getElementsByTagName("rect"));
        that.createBlocks("circle", svgDoc.getElementsByTagName("circle"));
        that.createBlocks("path", svgDoc.getElementsByTagName("path"));
        if (that.config.save) {
          console.log(that.data)
          localStorage.setItem(that.file, JSON.stringify(that.data))
        }
        if (that.config.done) {
          that.config.done(that.added, new Date() - that.beg, false)
        }
      });
    }
  }

  createBlocks(type, list) {
    let block
    for (let r = 0; r < list.length; r++) {
      let options = {
        ...this.options
      }
      // console.log(type, list[r])
      let attributes = this.attributes2object(list[r])
      if (type == 'rect') {
        attributes.x = (attributes.x || 0) + this.config.offset.x
        attributes.y = (attributes.y || 0) + this.config.offset.y
      }
      if (type == 'circle') {
        attributes.cx = (attributes.cx || 0) + this.config.offset.x
        attributes.cy = (attributes.cy || 0) + this.config.offset.y
      }
      if (attributes["fill-opacity"]) {
        attributes.fill += (Math.round(attributes["fill-opacity"] * 255)).toString(16).toUpperCase()
      }
      let points = null
      let center = null
      let attrs
      if (attributes.transform) {
        let trans = attributes.transform.split(/[ \(\)]/)
        if (trans[0] == 'rotate') {
          // options.angle = radians(trans[1]);
          points = this.rotate(attributes.x, attributes.y, attributes.width, attributes.height, +trans[1])
          center = this.rotatePoint(attributes.x + attributes.width / 2, attributes.y + attributes.height / 2, attributes.x, attributes.y, +trans[1])
        } else if (trans[0] == 'matrix') {
          points = this.matrix(attributes.x, attributes.y, attributes.width, attributes.height, +trans[1], +trans[2], +trans[3], +trans[4], +trans[5], +trans[6])
          center = this.matrixPoint(attributes.x + attributes.width / 2, attributes.y + attributes.height / 2, +trans[1], +trans[2], +trans[3], +trans[4], +trans[5], +trans[6])
        }
      }
      if (type == 'rect') {
        if (points) {
          // console.log(center, points)
          attrs = {
            x: center.x,
            y: center.y,
            scale: 1.0,
            points: points,
            color: attributes.fill,
            stroke: attributes.stroke,
            id: attributes.id
          }
          block = new PolygonFromPoints(
            this.world,
            attrs,
            options
          );
        } else {
          attrs = {
            x: attributes.x + attributes.width / 2,
            y: attributes.y + attributes.height / 2,
            w: attributes.width,
            h: attributes.height,
            color: attributes.fill,
            stroke: attributes.stroke,
            id: attributes.id
          }
          block = new Block(
            this.world,
            attrs,
            options
          );
          if (options.angle) {
            Matter.Body.translate(block.body, {
              x: attributes.height * Math.sin(-options.angle) + attributes.width * Math.sin(1 - options.angle),
              y: attributes.height * Math.sin(options.angle) + attributes.width * Math.sin(1 - options.angle)
            });
          }
        }
        if (this.config.save) {
          delete options.plugin.block
          this.data.rect.push({ attrs: attrs, options: options })
        }
      } else {
        if (type == 'circle') {
          attrs = {
            x: attributes.cx,
            y: attributes.cy,
            r: attributes.r,
            color: attributes.fill,
            stroke: attributes.stroke,
            id: attributes.id
          }
          block = new Ball(
            this.world,
            attrs,
            options
          );
          if (options.angle) {
            Matter.Body.translate(block.body, {
              x: attributes.height * Math.sin(-options.angle) + attributes.width * Math.sin(1 - options.angle),
              y: attributes.height * Math.sin(options.angle) + attributes.width * Math.sin(1 - options.angle)
            });
          }
          if (this.config.save) {
            delete options.plugin.block
            this.data.circle.push({ attrs: attrs, options: options })
          }
        } else {
          if (type == 'path') {
            const vertices = Matter.Svg.pathToVertices(list[r], this.config.sample).map(v => ({ x: v.x + this.config.offset.x, y: v.y + this.config.offset.y }));
            const attrs = {
              scale: 1.0,
              fromVertices: vertices,
              color: attributes.fill,
              stroke: attributes.stroke,
              sample: this.config.sample,
              id: attributes.id
            }
            block = new PolygonFromSVG(
              this.world,
              attrs,
              options
            );
            if (this.config.save) {
              delete options.plugin.block
              this.data.path.push({ attrs: attrs, options: options })
            }
          }
        }
      }
      this.blocks.push(block);
      if (attributes.id) {
        this.added[attributes.id] = block
      }
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
    // console.log(x, y, w, h, a)
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
