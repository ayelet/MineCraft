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
  gameEngine.playerState = state;
}

function blockClickHandler(e) {
  // console.log("div clicked",e.currentTarget) ;

  //TODO: change from pseudo code to real code
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
  console.log(gameEngine.playerState);
  if (gameEngine.playerState === playerState.mining)
    gameEngine.removeBlock(e.currentTarget);
  else if (gameEngine.playerState === playerState.building)
    gameEngine.addBlock(e.currentTarget);
}
const BlockTypes = {
  DIRT: "dirt",
  SKY: "sky",
  ROCK: "rock",
  CLOUD: "cloud",
  WOOD: "wood",
  LEAF: "leaf",
  SUN: "sun",
};

/////////////////////////////////////
class GameEngine {
  constructor() {
    this.gameWorld = new GameWorld(20, 30, 3, 4); // rows, columns, numTrees, numRocks
    this.playerState = playerState.mining;
    this.inventory = new Inventory();
  }
  startGame() {
    // console.log(this, "startGame");
    this.gameWorld.generateWorld();
    this.gameWorld.pickTool(Tooltype.AXE); // default tool
    this.gameWorld.player = Player.building; // default starting state
    console.log(this.gameWorld);
  }
  removeBlock(block) {
    let blockType = this.gameWorld.getBlockType(block);
    if (this.gameWorld.removeBlock(block))
      this.updateInventory(Inventory.Produce, blockType);
  }

  addBlock(block) {
    this.gameWorld.addBlock(block);
    this.UpdateInventory(Inventory.Consume, blockType);
  }

  updateInventory(action, blockType) {}
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
      this.inventory.currentTool = type;
    } catch (err) {
      console.log(err);
    }
  }

  generateInventory() {}
  getBlockType(block) {
    let type = block.classList[1];
    console.log("get block type: ", type);
    return type;
  }
  addBlock(block) {
    this.getBlockType(block);
    this.map.addBlock(block, BlockTypes.DIRT);
  }
  removeBlock(block) {
    let blockType = this.getBlockType(block);
    console.log("block type ", blockType);
    if (Resources.isResource(blockType)) {
      console.log(blockType, " is resource");
      this.map.removeBlock(block);
      this.map.addBlock(block, BlockTypes.SKY);
      return true;
    }
    console.log(blockType, " is not a resource");
    return false;
  }
}
/////////////////////////////////////////
class WorldMap {
  constructor(_rows = 10, _columns = 10, _nTrees = 2, _nRocks = 3) {
    // console.log("WorldMap()");
    this.rows = _rows;
    this.columns = _columns;
    this.blocks = new Array();
    this.nTrees = _nTrees;
    this.nRocks = _nRocks;
    this.nClouds = randomInt(6, 2); // random number of clouds
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
      this.createSun();
      this.createDirt();
      for (let i = 0; i < this.nClouds; i++) this.createCloud();
      // createSand() {};
      // createTrees(){};
      this.createTree();
      this.createRock();
    } catch (err) {
      console.log(this, err);
    }
  }
  addBlock(block, type) {
    this.removeBlock(block);
    block.classList.add(type);
    console.log("Adding block", block, type);
  }
  removeBlock(block) {
    // console.log("remove block");
    console.log(block.classList);
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
  createSun() {
    let seedX = randomInt(0.05 * this.rows, 1);
    let seedY = randomInt(0.05 * this.columns, 1);
    let sun = new Sun(this.rows, this.columns);
    sun.form.forEach((i) => {
      let seed = seedX * this.columns + seedY;
      let curr = seed + i;
      this.addBlock(this.blocks[curr], BlockTypes.SUN);
    });
  }
  createCloud() {
    //pick a random spot in the sky
    let seedX = randomInt(0.2 * this.rows, 2); // selects a row in the sky area
    let seedY = randomInt(this.columns);
    let cloud = new Cloud(this.rows, this.columns);
    const cloudType = randomInt(cloud.formations.length);
    for (let i = 0; i < cloud.formations[cloudType].length; i++) {
      let seed = seedX * this.columns + seedY;
      let curr = seed + cloud.formations[cloudType][i];
      //   if (curr < 0 || curr > this.blocks.length) { //TODO: handle out of range indices
      // throw "error in cloud formation";
      this.addBlock(this.blocks[curr], BlockTypes.CLOUD);
    }
  }
  createRock() {
    // first, let's add some rocks to the bottom of the world
    console.log("creating rocks");
    for (let i = this.rows - 2; i < this.rows; i++)
      for (let j = 0; j < this.columns; j++) {
        let curr = i * this.columns + j;
        console.log("curr: ", curr, i, j);
        // this.removeBlock(this.blocks[curr]);
        this.addBlock(this.blocks[curr], BlockTypes.ROCK);
      }
    // now lets add some random rocks
    for (let i = 0; i < this.nRocks; i++) {
      let seedX = randomInt(this.rows * 0.4, this.rows * 0.6);
      let seedY = randomInt(this.columns);
      let rock = new Rock(this.rows, this.columns);
      let rockType = randomInt(rock.forms.length);
      for (let i = 0; i < rock.forms[rockType].length; i++) {
        let seed = seedX * this.columns + seedY;
        let curr = seed + rock.forms[rockType][i];
        //   if (curr < 0 || curr > this.blocks.length) { //TODO: handle out of range indices
        // throw "error in cloud formation";
        this.addBlock(this.blocks[curr], BlockTypes.ROCK);
      }
    }
  }

  createTree() {
    console.log("creating trees");
    // build a tree stump from bottom up
    let seedX = this.rows * 0.6; // face of earth
    let seedY = randomInt(this.columns);
    let tree = new Tree(this.rows, this.columns);
    let topOfStump;
    for (let i = 0; i < tree.stumps[0].length; i++) {
      let seed = seedX * this.columns + seedY;
      let curr = seed + tree.stumps[0][i];
      topOfStump = curr;
      this.addBlock(this.blocks[curr], BlockTypes.WOOD);
    }
    // now let's creat some leaves
    for (let i = 0; i < tree.leaves[0].length; i++) {
        let seed = topOfStump - 2;
      let curr = seed + tree.leaves[0][i];

      this.addBlock(this.blocks[curr], BlockTypes.LEAF);
    }
  }
} // class WorldMap

///////////////////////////////////////////////
const Tooltype = {
  AXE: "axe",
  PICKAXE: "pickaxe",
  SHOVEL: "shovel",
};
//////////////////////////////////////////////
class Resources {
  constructor() {}
  static list = [
    BlockTypes.DIRT,
    BlockTypes.ROCK,
    BlockTypes.WOOD,
    BlockTypes.LEAF,
  ];

  static isResource = function (material) {
    return Resources.list.includes(material);
  };
  addResource(material) {
    if (!(material in this.list)) this.list.push(material);
  }
}

///////////////////////////////////////////////
class Inventory {
  constructor() {
    this.tools = {
      axe: Tooltype.AXE,
      pickaxe: Tooltype.PICKAXE,
      shovel: Tooltype.SHOVEL,
    }; // tool list
    this.currentTool = this.tools.shovel; //current tool that player picked
    this.size = 0; // size of inventory
    this.resources = { dirt: 0, rock: 0, wood: 0, leaves: 0 }; // list of materials
  }
  addResource(type) {
    if (type in this.resources) this.resources.type++;
    this.size++;
  }
  removeResource(type) {
    if (type in this.resources && this.resources.type > 0)
      this.resources.type--;
  }
}
///////////////////////////////////////////////////
//TODO: block class
class Block {
  constructor() {}
}
///////////////////////////////////////////////////////

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
class Rock {
  constructor(rows, col) {
    this.cols = col;
    this.rows = rows;

    // start from bottom to top
    this.forms = [
      [
        0,
        1,
        2,
        3,
        -col,
        -col + 1,
        -col + 2,
        -col + 3,
        -col * 2 + 1,
        -col * 2 + 2,
        -col * 2 + 3,
        -col * 3 + 1,
        -col * 3 + 2,
      ],
      [0, 1, 2, -col, -col + 1, -col + 2, -col * 2 + 1],
      [
        0,
        1,
        2,
        3,
        -col * 1 + 0,
        -col * 1 + 1,
        -col * 1 + 2,
        -col * 1 + 3,
        -col * 2 + 1,
        -col * 2 + 2,
      ],
    ];
  }
}
class Sun {
  constructor(rows, col) {
    this.form = [
      1,
      2,
      3,
      col * 1 + 0,
      col * 1 + 1,
      col * 1 + 2,
      col * 1 + 3,
      col * 1 + 4,
      col * 2 + 0,
      col * 2 + 1,
      col * 2 + 2,
      col * 2 + 3,
      col * 2 + 4,
      col * 3 + 0,
      col * 3 + 1,
      col * 3 + 2,
      col * 3 + 3,
      col * 3 + 4,
      col * 4 + 1,
      col * 4 + 2,
      col * 4 + 3,
    ];
  }
}
class Tree {
  constructor(rows, col) {
    this.cols = col;
    this.rows = rows;
    this.stumps = [];
    this.leaves = [];
    this.stump1 = [0, -col, -col * 2, -col * 3];
    this.stump2 = [
      0,
      1,
      col * 2,
      col * 2 + 1,
      col * 3,
      col * 3 + 1,
      col * 4,
      col * 4 + 1,
    ];
    this.stump3 = [
      0,
      col,
      col * 2,
      col * 3,
      col * 3 + 1,
      col * 4,
      col * 5,
      col * 6,
    ];
    this.stumps.push(this.stump1);
    this.stumps.push(this.stump2);
    this.stumps.push(this.stump3);

    this.leaves1 = [
      0,
      1,
      2,
      3,
      4,
      -col * 1,
      -col * 1 + 1,
      -col * 1 + 2,
      -col * 1 + 3,
      -col * 1 + 4,
      -col * 2,
      -col * 2 + 1,
      -col * 2 + 2,
      -col * 2 + 3,
      -col * 2 + 4,
      -col * 3,
      -col * 3 + 1,
      -col * 3 + 2,
      -col * 3 + 3,
      -col * 3 + 4,
      -col * 4,
      -col * 4 + 1,
      -col * 4 + 2,
      -col * 4 + 3,
      -col * 4 + 4,
    ];
    this.leaves.push(this.leaves1);
    console.log("created trees", this.stumps, this.leaves1);
    this.numStumps = this.stumps.length;
  }
}
