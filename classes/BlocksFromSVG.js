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
      let opts = {
        ...this.options
      }
      let attrs = this.attrs2object(list[r])
      if (attrs.transform) {
        opts.angle = radians(attrs.transform.split(/[ \(\)]/)[1]);
      }
      if (type == 'rect') {
        block = new Block(
          this.world, {
            x: attrs.x + attrs.width / 2,
            y: attrs.y + attrs.height / 2,
            w: attrs.width,
            h: attrs.height,
            color: attrs.fill,
          },
          opts
        );
        if (opts.angle) {
          Matter.Body.translate(block.body, {
            x: attrs.height * Math.sin(-opts.angle) + attrs.width * Math.sin(1 - opts.angle),
            y: attrs.height * Math.sin(opts.angle) + attrs.width * Math.sin(1 - opts.angle)
          });
        }
      } else
      if (type == 'circle') {
        block = new Ball(
          this.world, {
            x: attrs.cx,
            y: attrs.cy,
            r: attrs.r,
            color: attrs.fill,
          },
          opts
        );
        if (opts.angle) {
          Matter.Body.translate(block.body, {
            x: attrs.height * Math.sin(-opts.angle) + attrs.width * Math.sin(1 - opts.angle),
            y: attrs.height * Math.sin(opts.angle) + attrs.width * Math.sin(1 - opts.angle)
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
            color: attrs.fill,
          },
          opts
        );
      }
      this.blocks.push(block);
    }
  }

  attrs2object(elem) {
    let o = {}
    for (let a = 0; a < elem.attributes.length; a++) {
      let attr = elem.attributes[a]
      if (isNaN(+attr.nodeValue)) {
        o[attr.nodeName] = attr.nodeValue;
      } else {
        o[attr.nodeName] = +attr.nodeValue;
      }
    }
    return o
  }
}
