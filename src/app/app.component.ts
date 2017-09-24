import { Component } from '@angular/core';

let TileEnum = Object.freeze({
  BLACK: -1,
  NEUTRAL: 0,
  WHITE: 1
});

export class Board {
  
}

export class Tile {
  x: number;
  y: number;
  val: number;
}

let TILES: Tile[][] = new Array(8);
for (let i: number = 0; i < 8; ++i) {
  TILES[i] = new Array(8);
}

for (let i: number = 0; i < 8; ++i) {
  for (let j: number = 0; j < 8; ++j) {
    TILES[i][j] = { x: i, y: j, val: TileEnum.NEUTRAL };
  }
}

let turn: number = (Math.random() >= 0.5) ? TileEnum.BLACK : TileEnum.WHITE;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Othello';
  tiles = TILES;
  TileColor = TileEnum;
  clicked(x: number, y: number): void {
    TILES[x][y].val = turn;
    turn = (turn === TileEnum.BLACK) ? TileEnum.WHITE : TileEnum.BLACK;
  }
}
