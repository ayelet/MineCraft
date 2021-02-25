"use strict";

let playBtn = document.querySelector(".playBtn");
console.log(playBtn);
playBtn.addEventListener("click", startGame);

function startGame() {
  let landingPage = document.querySelector(".landing");
  landingPage.style.display = "none";
  let gameEngine = new GameEngine();
  gameEngine.startGame();
}
/////////////////////////////////////
class GameEngine {
  constructor() {
    this.gameWorld = new GameWorld(10, 10, 3, 4); // rows, columns, numTrees, numRocks
  }
  startGame() {
    console.log(this, "startGame");
    this.gameWorld.generateWorld();
    this.gameWorld.pickTool(Tool.AXE); // default tool
  }
}
/////////////////////////////////////////
class GameWorld {
  constructor(rows, columns, numTrees, numRocks) {
    this.map = new Map(rows, columns);
    this.inventory = new Inventory();
    this.currentTool = null;
  }
  currentTool;
  generateWorld() {
    try {
      let worldElement = document.querySelector(".gameWorld");
      if (worldElement === undefined) return false;
      console.log("calling create map");
      this.map.createMap(worldElement);
    } catch (err) {
      console.log(this, err);
    }
  }
  pickTool(type) {
     let world = document.querySelector('.gameWorld');
    switch(type) {
        case Tool.AXE:
          world.classList.add('axe');
          world.classList.remove('sovel');
          world.classList


            
              
    }
  }
  generateInventory() {}
  addResource() {}
  removeResource() {}
}
/////////////////////////////////////////
class Map {
  constructor(_rows = 10, _columns = 10, _nTrees = 2, _nRocks = 2) {
    console.log("Map()");
    this.rows = _rows;
    this.columns = _columns;
    this.blocks = new Array();
    this.nTrees = _nTrees;
    this.nRocks = _nRocks;
    this.nClouds = Math.floor(Math.random() * 6); // random number of clouds between 0 to 6
    this.worldElement = null;
  }

  createMap(worldElement) {
    try {
      this.worldElement = document.querySelector(".gameWorld");
      if (this.worldElement === undefined) throw "world not defined";
      // this.worldElement = worldElement;
      // console.log(this.worldElement);
      //create general blocks
      let numBlocks = this.rows * this.columns;
      this.worldElement.style.display = "grid";
      this.worldElement.style.gridTemplateRows = `repeat(${this.rows}, "1fr")`;
      this.worldElement.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
      for (let i = 0; i < numBlocks; i++) {
        let block = new Block();
        let div = document.createElement("div");
        div.classList.add("block");
        div.classList.add("sky");
        this.blocks.push(div);
        this.worldElement.appendChild(div);
      }
      this.createDirt();
      // createSand() {};
      // createTrees(){};
      // createRocks(){};
      // createClouds(){};
    } catch (err) {
      console.log(this, err);
    }
  }
  createDirt() {
    // let start = Math.floor(0.6 * this.rows);
    // let end = Math.floor(1 * this.rows);
    let start = 0, end = 3;
    // let dirtBlock = document.querySelector('.dirt');
    for (let row = start; row < end; row++)
      for (let col = 0; col < this.columns; col++) {
          let i = row * this.columns + col;
          this.blocks[i].classList.remove("sky");
          this.blocks[i].classList.add("dirt");
          console.log(i,this.blocks[i], this.rows, this.columns);
        }
        console.log(this.blocks,this.blocks.length, typeof(this.blocks[0]));
  }
}
////////////////////////////////////////////
//TODO: class tool
class Tool {
  constructor() {}
  const type = {
	AXE: "axe",
	PICKAXE: "pickaxe",
	SHOVEL: "shovel",
}
}
///////////////////////////////////////////////
// TODO: Inventory
class Inventory {
  constructor() {}
  tools; // tool list
  currentTool; //current tool that player picked
  size; // size of inventory
  materials; // list of materials
}
///////////////////////////////////////////////////
//TODO: block class
class Block {
  constructor() {}
}
///////////////////////////////////////////////////////
//TODO: class wood
class Wood extends Block {}

// document.createElement("div");
