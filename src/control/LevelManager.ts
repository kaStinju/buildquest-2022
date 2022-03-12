import Phaser from 'phaser'

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
}

export default class LevelManager {

  scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, levelConfig: LevelConfig, tilesConfig: TilesConfig) {

    this.scene = scene;

    const mapWidth = levelConfig.roomsHorizontal * levelConfig.roomHeight;
    const mapHeight = levelConfig.roomsVertical * levelConfig.roomHeight;

    const tilemap = this.scene.add.tilemap(
      undefined,
      undefined,
      undefined,
      mapWidth,
      mapHeight,
    );

    const tileset = tilemap.addTilesetImage(
      tilesConfig.image,
      undefined,
      tilesConfig.tileWidth,
      tilesConfig.tileHeight,
    );

    tilemap.createBlankLayer('layer1', tileset);

    for (let i = 0; i < mapWidth; i ++) {
      for (let j = 0; j < mapHeight; j ++) {
        tilemap.putTileAt((i + j) % 2, i, j);
      }
    }
  }

}
