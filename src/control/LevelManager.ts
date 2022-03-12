import Phaser from 'phaser'
import seedrandom from 'seedrandom'
import Wall from '../objects/Wall';
import Enemy from '../objects/Enemy';

interface TilesConfig {
  /**
   * The image to use for the tileset
   */
  image: string;

  /**
   * The width of single tile, in pixels
   */
  tileWidth: number;

  /**
   * The height of single tile, in pixels
   */
  tileHeight: number;
}

interface LevelConfig {
  /**
   * Map width, in rooms
   */
  roomsHorizontal: number;

  /**
   * Map height, in rooms
   */
  roomsVertical: number;

  /**
   * Room width, in tiles
   */
  roomWidth: number;

  /**
   * Room height, in tiles
   */
  roomHeight: number;

  /**
   * Door width for up and down walls
   */
  doorWidth: number;

  /**
   * Door height for right and left walls
   */
  doorHeight: number;

  /**
   * Between 0 - 1: amount of level volume that is full of rooms
   */
  fill: number;
}

export default class LevelManager {

  scene: Phaser.Scene;
  tilemap: Phaser.Tilemaps.Tilemap;
  staticGroup: Phaser.Physics.Arcade.StaticGroup;

  levelConfig: LevelConfig;
  tilesConfig: TilesConfig;

  constructor(scene: Phaser.Scene, levelConfig: LevelConfig, tilesConfig: TilesConfig) {

    this.scene = scene;
    this.levelConfig = levelConfig;
    this.tilesConfig = tilesConfig;
    this.staticGroup = scene.physics.add.staticGroup();

    const mapWidth = levelConfig.roomsHorizontal * levelConfig.roomWidth;
    const mapHeight = levelConfig.roomsVertical * levelConfig.roomHeight;

    this.tilemap = this.scene.add.tilemap(
      undefined,
      undefined,
      undefined,
      mapWidth,
      mapHeight,
    );

    const tileset = this.tilemap.addTilesetImage(
      tilesConfig.image,
      undefined,
      tilesConfig.tileWidth,
      tilesConfig.tileHeight,
    );

    this.tilemap.createBlankLayer('layer1', tileset);
  }

  placeWall(index: number, x: number, y: number) {
    this.tilemap.putTileAt(index, x, y);
    this.staticGroup.add(
      new Wall(
        this.scene,
        x * this.tilesConfig.tileWidth,
        y * this.tilesConfig.tileHeight,
      ),
    );
  }

  placeFloor(index: number, x: number, y: number) {
    this.tilemap.putTileAt(index, x, y);
  }

  placeEnemy(x: number, y: number) {
    new Enemy(
      this.scene,
      x * this.tilesConfig.tileWidth + 16,
      y * this.tilesConfig.tileHeight + 16,
    );
  }

  generateRoom(
    rng: seedrandom.PRNG,
    i: number,
    j: number,
    up: boolean,
    down: boolean,
    left: boolean,
    right: boolean,
  ) {
    const startX = i * this.levelConfig.roomWidth;
    const startY = j * this.levelConfig.roomHeight;
    const stopX = startX + this.levelConfig.roomWidth;
    const stopY = startY + this.levelConfig.roomHeight;

    const doorStartX = startX + Math.floor(
      this.levelConfig.roomWidth / 2 - this.levelConfig.doorWidth / 2,
    );
    const doorStartY = startY + Math.floor(
      this.levelConfig.roomHeight / 2 - this.levelConfig.doorHeight / 2,
    );
    const doorStopX = doorStartX + this.levelConfig.doorWidth;
    const doorStopY = doorStartY + this.levelConfig.doorHeight;

    const wallIndex = Math.abs(rng.int32()) % 9;
    const floorIndex = Math.abs(rng.int32()) % 9;

    const entryCount = [up, down, left, right].reduce((n, b) => b ? n + 1 : n, 0);

    const isTunnel = entryCount > 1 && Math.abs(rng.int32()) % 3 == 0;

    const markGround = (x: number, y: number) => {
      this.placeFloor(floorIndex, x, y);
      const odds = Math.floor(
        (this.levelConfig.roomHeight * this.levelConfig.roomWidth) / 5,
      );
      if (Math.abs(rng.int32()) % odds == 0) {
        this.placeEnemy(x, y);
      }
    }

    if (isTunnel) {
      for (let x = doorStartX - 1; x < doorStopX + 1; x ++) {
        for (let y = doorStartY - 1; y < doorStopY + 1; y ++) {
          markGround(x, y);
        }
      }
      this.placeWall(wallIndex, doorStartX - 1, doorStartY - 1);
      this.placeWall(wallIndex, doorStartX - 1, doorStopY);
      this.placeWall(wallIndex, doorStopX, doorStartY - 1);
      this.placeWall(wallIndex, doorStopX, doorStopY);
      if (up) {
        for (let y = startY; y < doorStartY - 1; y ++) {
          this.placeWall(wallIndex, doorStartX - 1, y);
          for (let x = doorStartX; x < doorStopX; x ++) {
            markGround(x, y);
          }
          this.placeWall(wallIndex, doorStopX, y);
        }
      } else {
        for (let x = doorStartX; x < doorStopX; x ++) {
          this.placeWall(wallIndex, x, doorStartY - 1);
        }
      }
      if (down) {
        for (let y = doorStopY + 1; y < stopY; y ++) {
          this.placeWall(wallIndex, doorStartX - 1, y);
          for (let x = doorStartX; x < doorStopX; x ++) {
            markGround(x, y);
          }
          this.placeWall(wallIndex, doorStopX, y);
        }
      } else {
        for (let x = doorStartX; x < doorStopX; x ++) {
          this.placeWall(wallIndex, x, doorStopY);
        }
      }
      if (left) {
        for (let x = startX; x < doorStartX - 1; x ++) {
          this.placeWall(wallIndex, x, doorStartY - 1);
          for (let y = doorStartY; y < doorStopY; y ++) {
            markGround(x, y);
          }
          this.placeWall(wallIndex, x, doorStopY);
        }
      } else {
        for (let y = doorStartY; y < doorStopY; y ++) {
          this.placeWall(wallIndex, doorStartX - 1, y);
        }
      }
      if (right) {
        for (let x = doorStopX + 1; x < stopX; x ++) {
          this.placeWall(wallIndex, x, doorStartY - 1);
          for (let y = doorStartY; y < doorStopY; y ++) {
            markGround(x, y);
          }
          this.placeWall(wallIndex, x, doorStopY);
        }
      } else {
        for (let y = doorStartY; y < doorStopY; y ++) {
          this.placeWall(wallIndex, doorStopX, y);
        }
      }
    } else {
      // Not tunnel
      for (let x = startX + 1; x < stopX - 1; x ++) {
        for (let y = startY + 1; y < stopY - 1; y ++) {
          markGround(x, y);
        }
      }
      for (let x = startX; x < stopX; x ++) {
        if (!(up && x >= doorStartX && x < doorStopX)) {
          this.placeWall(wallIndex, x, startY);
        } else {
          markGround(x, startY);
        }
        if (!(down && x >= doorStartX && x < doorStopX)) {
          this.placeWall(wallIndex, x, stopY - 1);
        } else {
          markGround(x, stopY - 1);
        }
      }

      for (let y = startY + 1; y < stopY - 1; y ++) {
        if (!(left && y >= doorStartY && y < doorStopY)) {
          this.placeWall(wallIndex, startX, y);
        } else {
          this.placeFloor(floorIndex, startX, y);
        }
        if (!(right && y >= doorStartY && y < doorStopY)) {
          this.placeWall(wallIndex, stopX - 1, y);
        } else {
          this.placeFloor(floorIndex, stopX - 1, y);
        }
      }

    }
  }

  generate() {
    const rng = seedrandom("asdf");

    const room = (i: number, j: number): number => {
      return j * this.levelConfig.roomsVertical + i;
    }

    const graph: { [key: number]: number[] } = {};

    const targetCount = Math.floor(
      this.levelConfig.roomsVertical *
      this.levelConfig.roomsHorizontal *
      this.levelConfig.fill,
    );

    const createEdge = (r1: number, r2: number) => {
      if (!graph[r1]) {
        graph[r1] = [];
      }
      if (!graph[r2]) {
        graph[r2] = [];
      }
      if (!graph[r1].includes(r2)) {
        graph[r1].push(r2);
      }
      if (!graph[r2].includes(r1)) {
        graph[r2].push(r1);
      }
    }

    let count = 1;
    let i = 0;
    let j = 0;
    graph[room(i, j)] = [];

    while (count < targetCount) {
      let newI = i;
      let newJ = i;
      let bad = false;
      switch(Math.abs(rng.int32()) % 4) {
        case 0: {
          if (j == 0) {
            bad = true;
          }
          newJ = j - 1;
          break;
        }
        case 1: {
          if (j == this.levelConfig.roomsVertical - 1) {
            bad = true;
          }
          newJ = j + 1;
          break;
        }
        case 2: {
          if (i == 0) {
            bad = true;
          }
          newI = i - 1;
          break;
        }
        case 3: {
          if (i == this.levelConfig.roomsHorizontal - 1) {
            bad = true;
          }
          newI = i + 1;
          break;
        }
      }
      if (bad) {
        continue;
      }
      if (!graph[room(newI, newJ)]) {
        count ++;
      }
      createEdge(room(i, j), room(newI, newJ));
      i = newI;
      j = newJ;
    }

    for (let i = 0; i < this.levelConfig.roomsHorizontal; i ++) {
      for (let j = 0; j < this.levelConfig.roomsVertical; j ++) {
        if (graph[room(i, j)]) {
          this.generateRoom(
            rng,
            i,
            j,
            graph[room(i, j)].includes(room(i, j - 1)),
            graph[room(i, j)].includes(room(i, j + 1)),
            graph[room(i, j)].includes(room(i - 1, j)),
            graph[room(i, j)].includes(room(i + 1, j)),
          );
        }
      }
    }
  }

}
