We use p5.js and matter.js to create interactive physics simulations. The p5-matter-examples repository contains a collection of examples that demonstrate how to use these libraries together and a few custom classes that make it easier to work with Matter.js. Your task is to create a new example that showcases a specific feature or concept.

## API docs of the p5-matter-classes
#file: ../../@types/classes/index.d.ts

## Code notes
- Two spaces for indentation
- Always use single quotes for strings
- New examples should be named `sketch.js` and placed in the `new-exmaple` directory

## Template for p5.js and matter.js examples

```javascript
let blockA;
let blockB;
let ball;
let ground;
let mouse;

function setup() {
  const canvas = createCanvas(800, 600);

  // create an engine
  let engine = Matter.Engine.create();
  let world = engine.world;

  // create two boxes and a ground
  blockA = new Block(world, { x: 200, y: 200, w: 80, h: 80, color: 'white' });
  blockB = new Block(world, { x: 270, y: 50, w: 160, h: 80, color: 'white' });
  ball = new Ball(world, { x: 100, y: 50, r: 40, color: 'white' });
  ground = new Block(
    world,
    { x: 400, y: 500, w: 810, h: 15, color: 'grey' },
    { isStatic: true, angle: PI/36 }
  );

  // add a mouse to manipulate Matter objects
  mouse = new Mouse(engine, canvas, { stroke: 'magenta', strokeWeight: 2 });

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background('black');
  blockA.draw();
  blockB.draw();
  ground.draw();
  ball.draw();
  mouse.draw();
}
```
