/** @typedef { import("../node_modules/@types/p5/index").Color } Color */

/** @typedef {{x: number; y: number; z?: number; u?: number; v?: number}} IVertex @see https://p5js.org/reference/#/p5/vertex */
/** @typedef {string | number[] | Color | any} IFill */
/** @typedef {IFill} IStroke */
/** @typedef {{x: number; y: number; w: number; h: number; color?: IFill; stroke?: IStroke; weight?: number;}} IBlockCoreAttributes */

/**
Creates a basic class to hold a new rigid body model with a rectangular hull. <br/>
<br/>
This class allows the block <br/>
- to be drawn with various attributes <br/>
- to be placed as a rectangle "block" in the world as a physical Matter body <br/>

@param {Matter.World} world - The Matter.js world object
@param {IBlockCoreAttributes} attributes - Visual properties e.g. position, dimensions and color
@param {Matter.IChamferableBodyDefinition} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move

@tutorial
XX - Benno Step 7
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/xx-benno-step7/">Open example</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/xx-benno-step7/sketch.js">open code</a>
*/

class BlockCore {
  /** @type {Matter.World} */ world;
  /** @type {IBlockCoreAttributes} */ attributes;
  /** @type {Matter.IChamferableBodyDefinition} */ options;

  /**
   * @param {Matter.World} world // TODO: Add description
   * @param {IBlockCoreAttributes} attributes // TODO: Add description
   * @param {Matter.IChamferableBodyDefinition} [options] // TODO: Add description
   */
  constructor(world, attributes, options) {
    this.world = world;
    this.attributes = attributes;
    this.options = options || {};
    this.options.plugin = this.options.plugin || {};
    this.options.plugin.block = this;
    this.addBody();
    if (this.body) {
      Matter.World.add(this.world, this.body);
      if (this.options.restitution) {
        this.body.restitution = this.options.restitution;
      }
    }
  }

  addBody() {
    this.body = Matter.Bodies.rectangle(this.attributes.x, this.attributes.y, this.attributes.w, this.attributes.h, this.options);
  }

  /**
   * Draws the matter body to the p5 canvas
   * @memberof BlockCore
   */
  draw() {
    if (this.body) {
      if (this.attributes.color) {
        fill(this.attributes.color);
      } else {
        noFill();
      }
      if (this.attributes.stroke) {
        stroke(this.attributes.stroke);
        if (this.attributes.weight) {
          strokeWeight(this.attributes.weight);
        }
      } else {
        noStroke();
      }
      this.drawBody();
    }
  }

  drawBody() {
    if (this.body.parts && this.body.parts.length > 1) {
      // skip index 0
      for (let p = 1; p < this.body.parts.length; p++) {
        this.drawVertices(this.body.parts[p].vertices);
      }
    } else {
      if (this.body.type == "composite") {
        // TODO: Die Eigenschaft "bodies" ist für den Typ "Body" nicht vorhanden.ts(2339)
        for (let body of this.body.bodies) {
          this.drawVertices(body.vertices);
        }
      } else {
        this.drawVertices(this.body.vertices);
      }
    }
  }

  /**
   * @param {(IVertex | Matter.Vertex)[]} vertices // TODO: Add description
   */
  drawVertices(vertices) {
    beginShape();
    for (const vertice of vertices) {
      vertex(vertice.x, vertice.y);
    }
    endShape(CLOSE);
  }

}
