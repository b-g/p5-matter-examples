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

@param {world} world - The Matter.js world
@param {file} file - Path or URL to a SVG-file with multiple SVG Elements of type rect, circle or path
@param {array} blocks - All created blocks will be added to this array
@param {BodyOptions} [options] - Defines the common behaviour of all created blocks e.g. mass, bouncyness or whether it can move

@example
// Adding the furniture and accessories to the blocks array and into the matter world with coordinates perfectly matching the backdrop image.
new BlocksFromSVG(world, "furniture.svg", blocks, {
  isStatic: true, restitution: 0.0
})
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
