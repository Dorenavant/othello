import { Component } from '@angular/core';

export class Posn {
  x: number;
  y: number;
};

// Directions for moves to affect
const NORTH_EAST: Posn = {x: 1, y: 1};
const NORTH_WEST: Posn = {x: -1, y: 1};
const NORTH: Posn = {x: 0, y: 1};
const EAST: Posn = {x: 1, y: 0};
const directions: Posn[] = [NORTH_EAST, NORTH_WEST, NORTH, EAST];

const BOARD_SIZE = 8;

let TileEnum = Object.freeze({
  BLACK: -1,
  EMPTY: 0,
  WHITE: 1
});

export class Tile {
  x: number;
  y: number;
  val: number;
};

export class Board {
  _tiles: Tile[][];
  _tilesHover: boolean[][];
  _numBlack: number;
  _numWhite: number;

  constructor() {
    // Init board
    this._tiles = new Array(BOARD_SIZE)
    for (let i: number = 0; i < BOARD_SIZE; ++i) {
      this._tiles[i] = new Array(BOARD_SIZE);
    }

    // CSS Hover broken for some reason; use mouse enter and mouse leave with booleans to hover
    this._tilesHover = new Array(BOARD_SIZE);
    for (let i: number = 0; i < BOARD_SIZE; ++i) {
      this._tilesHover[i] = new Array(BOARD_SIZE);
    }
    this.clear();
  }

  public clear(): void {
    // Set posn values and clear board
    for (let i: number = 0; i < BOARD_SIZE; ++i) {
      for (let j: number = 0; j < BOARD_SIZE; ++j) {
        this._tiles[i][j] = { x: i, y: j, val: TileEnum.EMPTY };
      }
    }

    // Set 4 starting tiles
    this._tiles[BOARD_SIZE/2][BOARD_SIZE/2].val = TileEnum.BLACK;
    this._tiles[(BOARD_SIZE/2)-1][BOARD_SIZE/2].val = TileEnum.WHITE;
    this._tiles[BOARD_SIZE/2][(BOARD_SIZE/2)-1].val = TileEnum.WHITE;
    this._tiles[(BOARD_SIZE/2)-1][(BOARD_SIZE/2)-1].val = TileEnum.BLACK;
    this._numBlack = 2;
    this._numWhite = 2;

    // Clear hovers
    for (let i: number = 0; i < BOARD_SIZE; ++i) {
      for (let j: number = 0; j < BOARD_SIZE; ++j) {
        this._tilesHover[i][j] = false;
      }
    }
  }

  public get tiles(): Tile[][] {
    return this._tiles;
  }

  public set tiles(newTiles: Tile[][]) {
    this._tiles = newTiles;
  }

  public get tilesHover(): boolean[][] {
    return this._tilesHover;
  }

  public set tilesHover(newTilesHover: boolean[][]) {
    this._tilesHover = newTilesHover;
  }

  public get numBlack(): number {
    return this._numBlack;
  }

  public set numBlack(val: number) {
    this._numBlack = val;
  }

  public get numWhite(): number {
    return this._numWhite;
  }

  public set numWhite(val: number) {
    this._numWhite = val;
  }
};

let board = new Board();
let turn: number = (Math.random() >= 0.5) ? TileEnum.BLACK : TileEnum.WHITE;

// Recursive function that checks the effects of a move in the given direction
function spread(x: number, y: number, vec: Posn, dir: number): number {
  if (x < 0 || y < 0 || x >= BOARD_SIZE || y >= BOARD_SIZE) return 0;
  if (board.tiles[x][y].val === TileEnum.EMPTY) return 0;
  if (board.tiles[x][y].val === turn) return 1;
  let changed: number = spread(x+(vec.x*dir), y+(vec.y*dir), vec, dir)
  if (changed) {
    board.tiles[x][y].val = turn;
    return changed+1;
  }
  return 0;
}

// Checks if a move will make a change in the given direction
function spreadCheck(x: number, y: number, vec: Posn, dir: number, change: boolean): boolean {
  if (x < 0 || y < 0 || x >= BOARD_SIZE || y >= BOARD_SIZE) return false;
  if (board.tiles[x][y].val === TileEnum.EMPTY) return false;
  if (board.tiles[x][y].val === turn) return change;
  if (spreadCheck(x+(vec.x*dir), y+(vec.y*dir), vec, dir, true)) return true;
  return false;
}

// Spreads move's effect in 8 directions and returns number of tiles changed
function dirSpread(x: number, y: number): number {
  console.log("[" + x + " " + y + "]");
  let numChanged: number = 0, changed: number = 0;
  for (let dir of directions) { // Check 8 directions for changes and increment number of tiles changed
    changed = spread(x+dir.x, y+dir.y, dir, 1) - 1;
    if (changed > 0) numChanged += changed;
    changed = spread(x-dir.x, y-dir.y, dir, -1) - 1;
    if (changed > 0) numChanged += changed;
  }
  return numChanged;
}

function onGameEnd(): void {
  let numWhites: number = 0, numBlacks: number = 0;
  for (let tileRow of board.tiles) {
    for (let tile of tileRow) {
      if (tile.val === TileEnum.BLACK) ++numBlacks;
      else if (tile.val === TileEnum.WHITE) ++numWhites;
    }
  }
  if (numBlacks > numWhites) alert("Game Over! Black Wins!");
  else if (numBlacks < numWhites) alert("Game Over! White Wins!");
  else alert("Game Over! It's a tie!");
}

function clearBoard(): void {
  board = new Board();
  turn = (Math.random() >= 0.5) ? TileEnum.BLACK : TileEnum.WHITE;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

// export interface TileNumber {
//   name: string;
//   number: string;
// }

// let tile_numbers: TileNumber[] = [
// new TileNumber{ name: "Black", number: board.numBlack },
// {name: "White", number: board.numWhite}
// ]

export class AppComponent {
  showMoves = false;
  title = 'Othello';
  tiles = board.tiles;
  tilesHover = board.tilesHover;
  TileColor = TileEnum;
  currentTurn = turn;
  numBlack = board.numBlack;
  numWhite = board.numWhite;

  // GAME MECHANICS
  // Perform actions for click
  clicked(x: number, y: number): void {
    board.tiles[x][y].val = turn; // Change initial tile
    let changed: number = dirSpread(x, y); // Effect of move on board tiles
    this.numBlack += (turn === TileEnum.BLACK) ? changed + 1 : (changed*-1);
    this.numWhite += (turn === TileEnum.WHITE) ? changed + 1 : (changed*-1);
    turn = (turn === TileEnum.BLACK) ? TileEnum.WHITE : TileEnum.BLACK;
    this.currentTurn = turn;
    if (!this.movesExist()) {
      turn = (turn === TileEnum.BLACK) ? TileEnum.WHITE : TileEnum.BLACK;
      this.currentTurn = turn;
      if (!this.movesExist()) {
        onGameEnd();
      } else if (turn === TileEnum.WHITE) {
        alert("Black has no more moves.  Switching to White's turn.");
      } else {
        alert("White has no more moves.  Switching to Black's turn.");
      }
    }
  }

  // Check if moves exist for the current turn
  movesExist(): boolean {
    for (let x: number = 0; x < BOARD_SIZE; ++x) {
      for (let y: number = 0; y < BOARD_SIZE; ++y) {
        if (this.isValidMove(x, y)) return true;
      }
    }
    return false;
  }

  // Check to see if tile is a valid move
  isValidMove(x: number, y: number): boolean {
    if (board.tiles[x][y].val !== TileEnum.EMPTY) return false;
    for (let dir of directions) {
      if (spreadCheck(x+dir.x, y+dir.y, dir, 1, false)) return true;
      if (spreadCheck(x-dir.x, y-dir.y, dir, -1, false)) return true;
    }
    return false;
  }

  setHover(x: number, y: number, hover: boolean): void {
    this.tilesHover[x][y] = hover;
  }

  isHovered(x: number, y: number): boolean {
    return this.tilesHover[x][y];
  }

  reset_board(): void {
    clearBoard();
    this.tiles = board.tiles;
    this.tilesHover = board.tilesHover;
    this.currentTurn = turn;
    this.numBlack = board.numBlack;
    this.numWhite = board.numWhite;
  }
}
