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
  _tilesHover: boolean[][];
  constructor() {
    // Init board
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

    // CSS Hover broken for some reason; use mouse enter and mouse leave with booleans to hover
    this._tilesHover = new Array(BOARD_SIZE);
    for (let i: number = 0; i < BOARD_SIZE; ++i) {
      this._tilesHover[i] = new Array(BOARD_SIZE);
    }
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

// Checks if a move will make a change in the given direction
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  showMoves = false;
  title = 'Othello';
  tiles = board.tiles;
  tilesHover = board._tilesHover;
  TileColor = TileEnum;
  currentTurn = turn;

  clicked(x: number, y: number): void {
    board.tiles[x][y].val = turn;
    dirSpread(x, y);
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

  test(): void {
    console.log(this.showMoves);
  }

  movesExist(): boolean {
    for (let x: number = 0; x < BOARD_SIZE; ++x) {
      for (let y: number = 0; y < BOARD_SIZE; ++y) {
        if (this.isValidMove(x, y)) return true;
      }
    }
    return false;
  }

  isValidMove(x: number, y: number): boolean {
    if (board.tiles[x][y].val !== TileEnum.EMPTY) return false;
    for (let dir of directions) {
      if (spreadCheck(x+dir.x, y+dir.y, dir, 1, false)) return true;
      if (spreadCheck(x-dir.x, y-dir.y, dir, -1, false)) return true;
    }
    return false;
  }

  setHover(x: number, y: number, hover: boolean) {
        this.tilesHover[x][y] = hover;
  }

  isHovered(x: number, y: number): boolean {
    return this.tilesHover[x][y];
  }
}
