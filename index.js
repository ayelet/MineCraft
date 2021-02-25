"use strict";

let playBtn = document.querySelector('.playBtn');
console.log(playBtn);
playBtn.addEventListener('click', startGame);

// TODO: GameWorld
class GameWorld {

    constructor() {
        generateWorld(); // TODO: generateWorld
    }
    currentTool;


}

//TODO: map
class Map {
constructor(_rows=20, _columns=20){
    rows=_rows;
    columns=_columns;
}
createMap() {

}
}
//TODO: class tool
class Tool {
    constructor() {

    }
}

// TODO: Inventory
class Inventory {
    constructor() {

    }
    tools; // tool list
    currentTool; //current tool that player picked
    size; // size of inventory
    materials; // list of materials



}
//TODO: block class
class Block {
    constructor() {

    }
}
//TODO: class wood
class Wood extends Block {

}



