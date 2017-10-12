import { Component } from '@angular/core';

export class Posn {
  x: number;
  y: number;
};

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
  constructor() {
    this._tiles = new Array(BOARD_SIZE)
    for (let i: number = 0; i < BOARD_SIZE; ++i) {
      this._tiles[i] = new Array(BOARD_SIZE);
    }
    for (let i: number = 0; i < BOARD_SIZE; ++i) {
      for (let j: number = 0; j < BOARD_SIZE; ++j) {
        this._tiles[i][j] = { x: i, y: j, val: TileEnum.EMPTY };
      }
    }
    this._tiles[BOARD_SIZE/2][BOARD_SIZE/2].val = TileEnum.BLACK;
    this._tiles[(BOARD_SIZE/2)-1][BOARD_SIZE/2].val = TileEnum.WHITE;
    this._tiles[BOARD_SIZE/2][(BOARD_SIZE/2)-1].val = TileEnum.WHITE;
    this._tiles[(BOARD_SIZE/2)-1][(BOARD_SIZE/2)-1].val = TileEnum.BLACK;
  }

  public get tiles(): Tile[][] {
    return this._tiles;
  }

  public set tiles(newTiles: Tile[][]) {
    this._tiles = newTiles;
  }
};

let board = new Board();
let turn: number = (Math.random() >= 0.5) ? TileEnum.BLACK : TileEnum.WHITE;

function spread(x: number, y: number, vec: Posn, dir: number): boolean {
  if (x < 0 || y < 0 || x >= BOARD_SIZE || y >= BOARD_SIZE) return false;
  if (board.tiles[x][y].val === TileEnum.EMPTY) return false;
  if (board.tiles[x][y].val === turn) return true;
  if (spread(x+(vec.x*dir), y+(vec.y*dir), vec, dir)) {
    board.tiles[x][y].val = turn;
    return true;
  }
  return false;
}

function spreadCheck(x: number, y: number, vec: Posn, dir: number, change: boolean): boolean {
  if (x < 0 || y < 0 || x >= BOARD_SIZE || y >= BOARD_SIZE) return false;
  if (board.tiles[x][y].val === TileEnum.EMPTY) return false;
  if (board.tiles[x][y].val === turn) return change;
  if (spreadCheck(x+(vec.x*dir), y+(vec.y*dir), vec, dir, true)) return true;
  return false;
}

function dirSpread(x: number, y: number): void {
  for (let dir of directions) {
    spread(x+dir.x, y+dir.y, dir, 1);
    spread(x-dir.x, y-dir.y, dir, -1);
  }
}

// function movesExist(): boolean {
//   for (let tileRow of board.tiles) {
//     for (let tile of tileRow) {

//     }
  
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  showMoves = false;
  title = 'Othello';
  tiles = board.tiles;
  TileColor = TileEnum;
  currentTurn = turn;

  clicked(x: number, y: number): void {
    board.tiles[x][y].val = turn;
    dirSpread(x, y);
    turn = (turn === TileEnum.BLACK) ? TileEnum.WHITE : TileEnum.BLACK;
    this.currentTurn = turn;
  }

  test(): void {
    console.log(this.showMoves);
  }

  isValidMove(x: number, y: number): boolean {
    for (let dir of directions) {
      if (spreadCheck(x+dir.x, y+dir.y, dir, 1, false)) return true;
      if (spreadCheck(x-dir.x, y-dir.y, dir, -1, false)) return true;
    }
    return false;
  }
}
