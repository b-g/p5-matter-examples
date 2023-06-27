/**
Example of a custom class using badly drawn fish.

@param {world} world - The Matter.js world object
@param {object} attributes - Visual properties e.g. position, radius and color
@param {object} [options] - Defines the behaviour e.g. mass, bouncyness or whether it can move
@extends Block

@example
const attributes = {
  x: 300,
  y: 300,
  type: "catfish",
}

const options = {
  isStatic: true,
}

let fish = new Fish(world, attributes, options)
*/

class Fish extends Block {
    constructor(world, attributes, options) {
      super(world, attributes, options);
    }
  
    addBody() {
      // The load fish data depending on the fish type
      const fishData = this.getFishData(this.attributes.type)

      // Apply the data
      this.attributes.image = fishData.image
      this.attributes.w = fishData.w
      this.attributes.h = fishData.h

      // Create the body like normal
      this.body = Matter.Bodies.rectangle(this.attributes.x, this.attributes.y, this.attributes.w, this.attributes.h, this.options);
    }

    getFishData(fishType){
        // Path is a bit annoying because it's not relative to this file, but the HTML it's loaded with
        switch(fishType){
          case 'catfish':
              return {
                image: loadImage('../classes/Fish_CatFish.png'),
                w: 162,
                h: 77
              }

          case 'herring':
              return {
                image: loadImage('../classes/Fish_Herring.png'),
                w: 105,
                h: 44
              }
        }

        // Use catfish as fallback
        return {
          image: loadImage('../classes/Fish_CatFish.png'),
          w: 162,
          h: 77
        } 
    }
  }
  