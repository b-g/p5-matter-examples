/**
Creates a new rigid body model with a circle hull.

@param {Matter.World} world - The Matter.js world object
@param {object} attributes - Visual properties e.g. position, radius and color
@param {Matter.IBodyDefinition} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move
@extends Block

@example
const attributes = {
  x: 300,
  y: 300,
  r: 30,
  color: "magenta",
}

const options = {
  isStatic: true,
}

let magentaColoredBall = new Ball(world, attributes, options)

@tutorial
1 - Mouse Example
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/1-mouse/">Open preview</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/1-mouse/sketch.js">open code</a>

@tutorial
4 - Jumping Ball Example
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/4-jumping-ball/">Open preview</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/4-jumping-ball/sketch.js">open code</a>
*/
declare class Ball extends Block {
}
/**
Creates a new rigid body model with a rectangular hull.  <br/>
<br/>
This class allows the block <br/>
- to be constrained to other blocks or to the scene itself <br/>
- to apply a force from other blocks it collides with <br/>
- to rotate around its center via attribute rotate <br/>
- trigger an actions from other blocks it collides with <br/>

@param {Matter.World} world - The Matter.js world
@param {object} attributes - Visual properties e.g. position, dimensions and color
@param {Matter.IChamferableBodyDefinition} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move
@extends BlockCore

@example
const attributes = {
  x: 400,
  y: 500,
  w: 810,
  h: 15,
  color: "grey"
}

const options = {
  isStatic: true,
  angle: PI / 36
}

let box = new Block(world, attributes, options)

@tutorial
1 - Mouse Example
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/1-mouse/">Open preview</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/1-mouse/sketch.js">open code</a>
*/
declare class Block extends BlockCore {
    /** @type {Matter.Constraint[]} */ constraints: Matter.Constraint[];
    collisions: any[];
    offset: any;
    /**
     * Draws the constraints (if any) of the matter body to the p5 canvas
     * @method drawConstraints
     * @memberof Block
     */
    drawConstraints(): void;
    drawConstraint(constraint: any): void;
    update(): void;
    /**
     * Constrains this block to another block.
     * Constraints are used for specifying that a fixed distance must be maintained between two blocks (or a block and a fixed world-space position).
     * The stiffness of constraints can be modified via the options to create springs or elastic.
     * @param {Block} block
     * @param {Matter.IConstraintDefinition} [options]
     * @return {Matter.Constraint}
     * @memberof Block
     */
    constrainTo(block: Block, options?: Matter.IConstraintDefinition): Matter.Constraint;
    /**
     * Remove a constraint of this block to another block.
     * @param {Matter.Constraint} constraint
     * @memberof Block
     */
    removeConstraint(constraint: Matter.Constraint): void;
    /**
     * Adds a block to an internal collisions array, to check whether this block colides with another block
     * @param {Block} block
     * @memberof Block
     */
    collideWith(block: Block): void;
    /**
     * Draw an image "sprite" instead of the shape of the block.
     * Make sure to set attributes.image so that there is an image to draw.
     * @memberof Block
     */
    drawSprite(): void;
}
/**
Creates a basic class to hold a new rigid body model with a rectangular hull. <br/>
<br/>
This class allows the block <br/>
- to be drawn with various attributes <br/>
- to be placed as a rectangle "block" in the world as a physical Matter body <br/>

@param {Matter.World} world - The Matter.js world object
@param {object} attributes - Visual properties e.g. position, dimensions and color
@param {Matter.IChamferableBodyDefinition} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move

@tutorial
XX - Benno Step 7
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/xx-benno-step7/">Open example</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/xx-benno-step7/sketch.js">open code</a>
*/
declare class BlockCore {
    /**
     * @param {Matter.World} world
     * @param {object} attributes
     * @param {Matter.IChamferableBodyDefinition} options
     */
    constructor(world: Matter.World, attributes: object, options: Matter.IChamferableBodyDefinition);
    world: Matter.World;
    attributes: any;
    options: Matter.IChamferableBodyDefinition;
    addBody(): void;
    body: Matter.Body;
    /**
     * Draws the matter body to the p5 canvas
     * @memberof BlockCore
     */
    draw(): void;
    drawBody(): void;
    /**
     * @param {Matter.Vector[]} vertices
     * @memberof BlockCore
     */
    drawVertices(vertices: Matter.Vector[]): void;
}
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
declare class BlocksFromSVG {
    /**
     * @param {Matter.World} world
     * @param {string} file
     * @param {Block[]} blocks
     * @param {Matter.IChamferableBodyDefinition} options
     */
    constructor(world: Matter.World, file: string, blocks: Block[], options: Matter.IChamferableBodyDefinition);
    blocks: Block[];
    world: Matter.World;
    options: Matter.IChamferableBodyDefinition;
    promise: any;
    createBlocks(type: any, list: any): void;
    attributes2object(elem: any): {};
}
/**
Creates a chain of blocks, as defined in the attributes.

@param {world} world - The Matter.js world object
@param {object} attributes - Visual properties e.g. position and color
@param {object} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move
@extends Block
*/
declare class Chain extends Block {
    constructor(world: any, attributes: any, options: any);
    composite: Matter.Composite;
    /**
     * Adds an constraint to the internal constraints array.
     * @param {constraint} constraint
     * @memberof Chain
     */
    addConstraint(constraint: any): void;
}
/**
Create a magnet. A magnet is a ball that attracts or repels other bodies.

@param {world} world - Pass the Matter.js world
@param {object} attributes - Visual properties e.g. position, radius and color
@param {object} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move
@extends Ball
*/
declare class Magnet extends Ball {
    constructor(world: any, attributes: any, options: any);
    attracted: any[];
    isActive: any;
    /**
     * Adds a body to the internal attracted array of the magnet.
     * @param {body} obj
     * @memberof Magnet
     */
    addAttracted(obj: body): void;
    /**
     * Update the positions of all attracted boddies of the magnet.
     * @memberof Magnet
     */
    attract(): void;
    /**
     * Update the positions of all attracted boddies of the magnet, while using Newton's law of gravitation.
     * @memberof Magnet
     */
    gravity(): void;
}
/**
Creates a representation of the user's mouse for being able to interact with the Matter.js world.

@param {engine} world - Pass the Matter.js engine
@param {canvas} canvas - Pass the drawing canvas
@param {object} attributes - (Optional) Attributes like color

@example
let mouse = new Mouse(engine, canvas, { stroke: 'blue', strokeWeight: 3 })

@tutorial
1 - Mouse Example
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/1-mouse/">Open preview</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/1-mouse/sketch.js">open code</a>
*/
declare class Mouse {
    constructor(engine: any, canvas: any, attributes: any);
    attributes: any;
    mouse: Matter.Mouse;
    mouseConstraint: Matter.MouseConstraint;
    /**
     * Subscribes a callback function to the given object's eventName
     * @param {string} eventName
     * @param {function} action
     * @memberof Mouse
     */
    on(eventName: string, action: Function): void;
    /**
     * Sets the mouse position offset e.g. { x: 0, y: 0 }
     * @param {object} offset
     * @memberof Mouse
     */
    setOffset(offset: object): void;
    /**
     * Draws the mouse constraints to the p5 canvas
     * @memberof Mouse
     */
    draw(): void;
    drawMouse(): void;
}
/**
Creates Parts (group of bodies) as defined by the required options.parts.

@param {world} world - The Matter.js world object
@param {object} attributes - Visual properties e.g. position and color
@param {object} options - (Required) Defines the behaviour e.g. mass, bouncyness or whether it can move
@extends Block

@example
const parts = [
  Bodies.rectangle(4, 20, 5, 20),
  Bodies.rectangle(40 - 4, 20, 5, 20),
  Bodies.rectangle(20, +40 - 4, 50, 5)
]

const attributes = {
  x: 900,
  y: 730,
  color: "blue"
}

const options = {
  parts: parts,
  isStatic: true
}

let blockFromParts = new Parts(world, attributes, options)
*/
declare class Parts extends Block {
    constructor(world: any, attributes: any, options: any);
}
/**
Creates a new rigid body model with a regular polygon hull with the given number of sides and radius.

@param {world} world - The Matter.js world object
@param {object} attributes - Visual properties e.g. position, radius and color
@param {object} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move
@extends Block

@example
let polygon = new Polygon(world, {x: 300, y: 200, s: 5, r: 100, color: 'white'})

@tutorial
3 - Constraints Example
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/3-constraints/">Open example</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/3-constraints/sketch.js">open code</a>
*/
declare class Polygon extends Block {
    constructor(world: any, attributes: any, options: any);
}
/**
Creates a new rigid body model with a regular polygon hull based on a list of points.

@param {world} world - The Matter.js world object
@param {object} attributes - Visual properties e.g. position, points and color
@param {object} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move
@extends Block

@example
const points = [
  { x: 0, y: 0 },
  { x: 20, y: 10 },
  { x: 200, y: 30 },
  { x: 220, y: 50 },
  { x: 10, y: 20 }
]

const attributes = {
  x: 600,
  y: 580,
  points: points,
  color: "olive"
}

const options = {
  isStatic: true
}

let polygonBlock = new PolygonFromPoints(world, attributes, options)

@tutorial
XX - Benno Step 7
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/xx-benno-step7/">Open example</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/xx-benno-step7/sketch.js">open code</a>
*/
declare class PolygonFromPoints extends Block {
    constructor(world: any, attributes: any, options: any);
}
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
declare class PolygonFromSVG extends Block {
    addBodyVertices(vertices: any): void;
    /**
     * @param {Matter.Vector[]} vertices
     * @returns {Matter.Vector}
     * @memberof PolygonFromSVG
     */
    getCenter(vertices: Matter.Vector[]): Matter.Vector;
}
/**
Creates a stack of blocks.
Each block is defined via the cols, rows, colGap, rowGap attributes and the create function.

@param {world} world - Pass the Matter.js world
@param {object} attributes - Visual properties e.g. position, radius and color
@param {object} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move
@extends Block

@example
const attributes = {
  x: 550,
  y: 100,
  cols: 10,
  rows: 10,
  colGap: 5,
  rowGap: 5,
  color: "red",
  create: (bx, by) => Bodies.circle(bx, by, 10, { restitution: 0.9 })
}

let block = new CompositeBlock(world, attributes)

@tutorial
1 - Stacks Example
<a target="_blank" href="https://b-g.github.io/p5-matter-examples/1-stacks/">Open example</a>
,
<a target="_blank" href="https://github.com/b-g/p5-matter-examples/blob/master/1-stacks/sketch.js">open code</a>
*/
declare class Stack extends Block {
    constructor(world: any, attributes: any, options: any);
}


// ./sample/generate-types.bash - Last created: Di 20 Jun 2023 17:24:11 CEST
