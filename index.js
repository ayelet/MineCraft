"use strict";

//utility functions

// return a random number between 0 to number (optional: add offset as second argument)
const randomInt = (number, offset = 0) => {
  return Math.floor(Math.random() * number) + offset;
};

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
// change player state to mining or building
function changePlayerState(state) {
  gameEngine.gameWorld.player = state;
}

function blockClickHandler(e) {
  // console.log("div clicked",e.currentTarget) ;

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
  DIRT: "dirt",
  SKY: "sky",
  ROCK: "rock",
  CLOUD: "cloud",
  WOOD: "wood",
};
/////////////////////////////////////
class GameEngine {
  constructor() {
    this.gameWorld = new GameWorld(20, 30, 3, 4); // rows, columns, numTrees, numRocks
  }
  startGame() {
    // console.log(this, "startGame");
    this.gameWorld.generateWorld();
    this.gameWorld.pickTool(Tooltype.AXE); // default tool
    this.gameWorld.player = Player.mining; // default starting state
    console.log(this.gameWorld);
  }
  removeBlock(block) {
    this.gameWorld.removeBlock(block);
  }
}
/////////////////////////////////////////
class GameWorld {
  constructor(rows, columns, numTrees, numRocks) {
    this.map = new WorldMap(rows, columns);
    this.inventory = new Inventory();
    this.currentTool = null;
    this.player = "";
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
  removeBlock(block) {
    this.map.removeBlock(block);
  }
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
    this.nClouds = randomInt(8, 2); // random number of clouds between 0 to 6
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
        div.addEventListener("click", blockClickHandler);
        div.classList.add("block");
        div.classList.add("sky");
        this.blocks.push(div);
        this.worldElement.appendChild(div);
      }
      this.createDirt();
      for (let i = 0; i < this.nClouds; i++) this.createCloud();
      //   for (let i = 0; i < 1; i++) this.createCloud();
      // createSand() {};
      // createTrees(){};
      // createRocks(){};
    } catch (err) {
      console.log(this, err);
    }
  }
  addBlock(block, type) {
    block.classList.add(type);
    // console.log("Adding block", block, type);
  }
  removeBlock(block) {
    // console.log("remove block");
    for (const type in BlockTypes) {
      // console.log(type, BlockTypes[type]);
      block.classList.remove(BlockTypes[type]);
    }
    // block.classList.add(BlockTypes.SKY);
  }
  createDirt() {
    let start = Math.floor(0.6 * this.rows);
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

  createCloud() {
    //pick a random spot in the sky
    let seedX = randomInt(0.2 * this.rows, 2); // selects a row in the sky area
    let seedY = randomInt(this.columns);
    // console.log("*** creating cloud ****");
    // console.log("seed x ", seedX, "seed y ", seedY);
    let cloud = new Cloud(this.rows, this.columns);
    // console.log(cloud);
    const cloudType = randomInt(cloud.formations.length);
    // console.log("no. of form ", cloudType);
    for (let i = 0; i < cloud.formations[cloudType].length; i++) {
      let seed = seedX * this.columns + seedY;
      let curr = seed + cloud.formations[cloudType][i];
      //   if (curr < 0 || curr > this.blocks.length) { //TODO: handle out or range indices
      // throw "error in cloud formation";
      this.removeBlock(this.blocks[curr]);
      this.addBlock(this.blocks[curr], BlockTypes.CLOUD);
    }
  }
} // class WorldMap

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

class Player {}
const playerState = {
  mining: "mining",
  building: "building",
};
/////////////////////////////////////////
class Cloud {
  constructor(rows, columns) {
    this.cols = columns;
    this.rows = rows;
    this.formations = [];
    this.form1 = [
      0,
      1,
      2,
      columns,
      columns + 1,
      columns + 2,
      columns + 3,
      columns * 2 - 1,
      columns * 2,
      columns * 2 + 1,
      columns * 2 + 2,
    ];
    this.form2 = [
      0,
      columns - 1,
      columns,
      columns + 1,
      columns * 2 - 2,
      columns * 2 - 1,
      columns * 2,
      columns * 2 + 1,
      columns * 2 + 2,
    ];
    this.form3 = [0, 1, 2, columns + 2, columns + 3, columns + 4];
    this.formations.push(this.form1);
    this.formations.push(this.form2);
    this.formations.push(this.form3);
    console.log("created cloud formation", this.formations);
    this.numFormations = this.formations.length;
  }
}
// class Cloud {
//   constructor(rows, columns) {
//     this.cols = columns;
//     this.rows = rows;
//     this.formation = [];
//     this.formation.push = [
//       0,
//       1,
//       2,
//       columns,
//       columns + 1,
//       columns + 2,
//       columns + 3,
//       columns * 2 - 1,
//       columns * 2,
//       columns * 2 + 1,
//       columns * 2 + 2,
//     ];
//     this.formation.push = [
//       0,
//       columns - 1,
//       columns,
//       columns + 1,
//       columns * 2 - 2,
//       columns * 2 - 1,
//       columns * 2,
//       columns * 2 + 1,
//       columns * 2 + 2,
//     ];
//     console.log("created cloud formation", this.formation);
//     this.numFormations = this.formation.length;
//   }

// }
// document.createElement("div");
