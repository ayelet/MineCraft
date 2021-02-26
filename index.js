"use strict";

let playBtn = document.querySelector(".playBtn");
// console.log(playBtn);
playBtn.addEventListener("click", startGame);
let gameEngine = null;
function startGame() {
  let landingPage = document.querySelector(".landing");
  landingPage.style.display = "none";
  gameEngine = new GameEngine();
  gameEngine.startGame();
}

function blockClickHandler(e) {
    console.log("div clicked",e.currentTarget) ;

    //TODO: chage from pseudo code to real code
    // if (player holding tool){

        // if (axe) && (isWood) || 
        // (shovel) && (isDirt) ||
        // (PICKAXE) && (isRock)
        //     removeBlock();
        // else
        //     do nothing;
    // } else if (player holding resource)
        // addBlock()
        // gameEngine.addBlock(blockType);//TODO: removeBlock
        // gameEngine.updateInventory();//TODO: UpdateInventory
        gameEngine.removeBlock(e.currentTarget);

}
const BlockTypes = {
    DIRT: 'dirt',
    SKY: 'sky',
    ROCK: 'rock',
    CLOUD: 'cloud',
    WOOD: 'wood',
    }
/////////////////////////////////////
class GameEngine {
  constructor() {
    this.gameWorld = new GameWorld(15, 30, 3, 4); // rows, columns, numTrees, numRocks
  }
  startGame() {
    // console.log(this, "startGame");
    this.gameWorld.generateWorld();
    this.gameWorld.pickTool(Tooltype.AXE); // default tool
  }
  removeBlock(block) {this.gameWorld.removeBlock(block);}
}
/////////////////////////////////////////
class GameWorld {
  constructor(rows, columns, numTrees, numRocks) {
    this.map = new WorldMap(rows, columns);
    this.inventory = new Inventory();
    this.currentTool = null;
  }
  currentTool;
  generateWorld() {
    try {
      let worldElement = document.querySelector(".gameWorld");
      if (worldElement === undefined) return false;
      //   console.log("calling create map");
      this.map.createMap(worldElement);
    } catch (err) {
      console.log(this, err);
    }
  }
  pickTool(type) {
    try {
      let world = document.querySelector(".gameWorld");
      world.classList.remove("axe");
      world.classList.remove("shovel");
      world.classList.remove("pickaxe");
      switch (type) {
        case Tooltype.AXE:
          world.classList.add("axe");
          break;
        case Tooltype.SHOVEL:
          world.classList.add("shovel");
          break;
        case Tooltype.PICKAXE:
          world.classList.add("pickaxe");
          break;
          defualt: throw "invalid tool";
      }
      this.currentTool = type;
    } catch (err) {
      console.log(err);
    }
  }

  generateInventory() {}
  addBlock() {}
  removeBlock(block) { this.map.removeBlock(block);}
}
/////////////////////////////////////////
class WorldMap {
  constructor(_rows = 10, _columns = 10, _nTrees = 2, _nRocks = 2) {
    // console.log("WorldMap()");
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

      //create general blocks
      let numBlocks = this.rows * this.columns;
      this.worldElement.style.display = "grid";
      this.worldElement.style.gridTemplateRows = `repeat(${this.rows}, "1fr")`;
      this.worldElement.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
      for (let i = 0; i < numBlocks; i++) {
        let block = new Block();
        let div = document.createElement("div");
        div.addEventListener('click',(blockClickHandler));
        div.classList.add("block");
        div.classList.add("sky");
        this.blocks.push(div);
        this.worldElement.appendChild(div);
      }
      this.createDirt();
      for (let i=0; i < this.nClouds; i++)
        this.createCloud();
      // createSand() {};
      // createTrees(){};
      // createRocks(){};
    } catch (err) {
        console.log(this, err);
    }
}
addBlock(BlockType) {}
removeBlock(block) {
    console.log("remove block");
    for(const type in BlockTypes) {
        console.log(1);
        block.classList.remove(type);
    }
    block.classList.add(BlockTypes.SKY);


}
createDirt() {
    let start = Math.floor(0.7 * this.rows);
    let end = Math.floor(1 * this.rows);
    // let start = 0, end = 3;
    // let dirtBlock = document.querySelector('.dirt');
    for (let row = start; row < end; row++)
    for (let col = 0; col < this.columns; col++) {
        let i = row * this.columns + col;
        this.blocks[i].classList.remove("sky");
        this.blocks[i].classList.add("dirt");
        //   console.log(i,this.blocks[i], this.rows, this.columns);
    }
    // console.log(this.blocks,this.blocks.length, typeof(this.blocks[0]));
}
createCloud(){
    //pick a random spot in the sky
    let start = Math.floor(Math.random() * (0.4 * this.rows));
    let cloudHeight = Math.floor(Math.random()*3 + 3);
    console.log("cloud start", start, "Height", cloudHeight);
    for (let row=start; row < start+cloudHeight; row++){
        let colStart = Math.floor(Math.random()*this.columns)
        let colWidth = Math.floor(Math.random() * 5+ 2);
        for (let col= colStart; col < colStart+colWidth; col++) {
            let i = row * this.columns + col;
            console.log(i,": colstart", colStart, "colWidth", colWidth);
            this.blocks[i].classList.remove("sky");
            this.blocks[i].classList.add("cloud");    
        }
    }
};
}

////////////////////////////////////////////
//TODO: class tool
// class Tool {
//     constructor() {};
//     }
//   };

const Tooltype = {
  AXE: "axe",
  PICKAXE: "pickaxe",
  SHOVEL: "shovel",
};

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
