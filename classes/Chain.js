/**
Creates a chain of blocks, as defined in the attributes.

@param {world} world - The Matter.js world object
@param {object} attributes - Visual properties e.g. position and color
@param {object} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move
@extends Block

@example
const attributesRing = {
    x: 200,
    y: 200,
    num: 50,
    distX: 150, // closed: radius
    distY: 150, // closed: radius
    xLink: 0.0, // factor for constraint ancor on body
    yLink: 0.5, // factor for constraint ancor on body
    closed: true,
    color: 'blue',
    linkDraw: true,
    create: (bx, by) => Bodies.circle(bx, by, 10, { frictionAir: 0.01 }) 
  };

const attributesChain = {
    x: 450,
    y: 20,
    num: 35,
    distX: 0, // distance
    distY: 20, // distance
    xLink: 0.0, // factor for constraint ancor on body
    yLink: 0.5, // factor for constraint ancor on body
    closed: false,
    color: 'red',
    linkDraw: true,
    create: (bx, by) => Bodies.circle(bx, by, 10, { frictionAir: 0.01 }) 
  };

const attributesBridge = {
    x: 20,
    y: 800,
    num: 20,
    distX: 20, // distance
    distY: 0, // distance
    xLink: 0.5, // factor for constraint ancor on body
    yLink: 0.0, // factor for constraint ancor on body
    closed: false,
    color: 'red',
    linkDraw: true,
    fix: {beg: {x: 20, y: 600, options: { stiffness: 0.0, length: 200 }},
          end: {x: 400, y: 800, options: { stiffness: 0.0, length: 100 }}},
    create: (bx, by) => Bodies.circle(bx, by, 10, { frictionAir: 0.01 }) 
  };

const options = { stiffness: 0.8, length: 2}  

let ring = new Chain(world, attributesRing, options);
let chain = new Chain(world, attributesChain, options);
let bridge = new Chain(world, attributesBridge, options);
*/

class Chain extends Block {
    constructor(world, attributes, options) {
        super(world, attributes, options);
        this.constraints = Matter.Composite.allConstraints(this.body);
        this.constraints.forEach((constraint) => {
            if (this.attributes.linkDraw) {
                constraint.draw = true;
            }
        });
    }

    addBody() {
        this.body = Matter.Composite.create({ label: 'Chain' });
        if (this.attributes.closed) {
            for (let a = 0; a < 2 * Math.PI; a += (2 * Math.PI) / this.attributes.num) {
                Matter.Composite.addBody(this.body, this.attributes.create(this.attributes.x + this.attributes.distX * Math.sin(a), this.attributes.y + this.attributes.distY * Math.cos(a)));
            }
        } else {
            for (let b = 0; b < this.attributes.num; b++) {
                Matter.Composite.addBody(this.body, this.attributes.create(this.attributes.x + b * this.attributes.distX, this.attributes.y + b * this.attributes.distY));
            }
        }
        Matter.Composites.chain(this.body, this.attributes.xLink, this.attributes.yLink, -this.attributes.xLink, -this.attributes.yLink, this.options);
        this.connect();
    }

    connect() {
        const box = this.body.bodies[0].bounds;
        const size = { w: Math.round(box.max.x - box.min.x), h: Math.round(box.max.y - box.min.y) };
        if (this.attributes.closed) {
            Matter.Composite.add(
                this.body,
                Matter.Constraint.create({
                    bodyA: this.body.bodies[this.body.bodies.length - 1],
                    pointA: { x: size.w * this.attributes.xLink, y: size.h * this.attributes.yLink },
                    bodyB: this.body.bodies[0],
                    pointB: { x: size.w * this.attributes.xLink, y: -size.h * this.attributes.yLink },
                    ...this.options
                })
            );
        } else {
            if (this.attributes?.fix?.beg) {
                Matter.Composite.add(
                    this.body,
                    Matter.Constraint.create({
                        bodyA: null,
                        pointA: { x: this.attributes.fix.beg.x, y: this.attributes.fix.beg.y },
                        bodyB: this.body.bodies[0],
                        pointB: { x: -size.w * this.attributes.xLink, y: size.h * this.attributes.yLink },
                        ...this.attributes.fix.beg.options
                    })
                );
            }
            if (this.attributes?.fix?.end) {
                Matter.Composite.add(
                    this.body,
                    Matter.Constraint.create({
                        bodyA: null,
                        pointA: { x: this.attributes.fix.end.x, y: this.attributes.fix.end.y },
                        bodyB: this.body.bodies[this.body.bodies.length - 1],
                        pointB: { x: size.w * this.attributes.xLink, y: -size.h * this.attributes.yLink },
                        ...this.attributes.fix.end.options
                    })
                );
            }
        }
    }
}