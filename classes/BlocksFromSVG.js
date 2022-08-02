/**
Creates rigid body models based on a SVG-file.
Currently the SVG Elements of rect, circle and path are supported.

@param {world} world - The Matter.js world
@param {file} file - Path or URL to a SVG-file
@param {array} blocks - Some blocks
@param {BodyOptions} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move
*/

class BlocksFromSVG {
  constructor(world, file, blocks, options) {
    this.blocks = blocks;
    this.world = world;
    this.options = options || {};
    let that = this;
    this.promise = httpGet(file, "text", false, response => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(response, "image/svg+xml");
      that.createBlocks('rect', svgDoc.getElementsByTagName('rect'));
      that.createBlocks('circle', svgDoc.getElementsByTagName('circle'));
      that.createBlocks('path', svgDoc.getElementsByTagName('path'));
    });
  }

  createBlocks(type, list) {
    let block
    for (let r = 0; r < list.length; r++) {
      let options = {
        ...this.options
      }
      let attributes = this.attributes2object(list[r])
      if (attributes.transform) {
        options.angle = radians(attributes.transform.split(/[ \(\)]/)[1]);
      }
      if (type == 'rect') {
        block = new Block(
          this.world, {
            x: attributes.x + attributes.width / 2,
            y: attributes.y + attributes.height / 2,
            w: attributes.width,
            h: attributes.height,
            color: attributes.fill,
          },
          options
        );
        if (options.angle) {
          Matter.Body.translate(block.body, {
            x: attributes.height * Math.sin(-options.angle) + attributes.width * Math.sin(1 - options.angle),
            y: attributes.height * Math.sin(options.angle) + attributes.width * Math.sin(1 - options.angle)
          });
        }
      } else
      if (type == 'circle') {
        block = new Ball(
          this.world, {
            x: attributes.cx,
            y: attributes.cy,
            r: attributes.r,
            color: attributes.fill,
          },
          options
        );
        if (options.angle) {
          Matter.Body.translate(block.body, {
            x: attributes.height * Math.sin(-options.angle) + attributes.width * Math.sin(1 - options.angle),
            y: attributes.height * Math.sin(options.angle) + attributes.width * Math.sin(1 - options.angle)
          });
        }
      } else
      if (type == 'path') {
        block = new PolygonFromSVG(
          this.world, {
            x: 0,
            y: 0,
            scale: 1.0,
            fromPath: list[r],
            color: attributes.fill,
          },
          options
        );
      }
      this.blocks.push(block);
    }
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
