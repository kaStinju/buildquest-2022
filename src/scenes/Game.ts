import Phaser from 'phaser';
import Player from '../objects/Player';
import LevelManager from '../control/LevelManager';
import CameraController from '../control/CameraController';

export default class Demo extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.image('slime', 'assets/slime.png');
    this.load.image('tiles', 'assets/tileset.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.spritesheet(
      'enemy',
      'assets/enemy.png',
      { frameWidth: 32, frameHeight: 32 },
    );
    this.load.spritesheet(
      'playerSide',
      'assets/playerSide.png',
      { frameWidth: 32, frameHeight: 32 },
    );
    this.load.spritesheet(
      'playerBack',
      'assets/playerBack.png',
      { frameWidth: 32, frameHeight: 32 },
    );
    this.load.spritesheet(
      'playerForward',
      'assets/playerForward.png',
      { frameWidth: 32, frameHeight: 32 },
    );
  }

  create() {
    const logo = this.add.image(400, 70, 'logo');

    const level = new LevelManager(
      this,
      {
        roomsVertical: 10,
        roomsHorizontal: 10,
        roomWidth: 20,
        roomHeight: 15,
        doorWidth: 4,
        doorHeight: 4,
        fill: 0.5,
      },
      {
        image: 'tiles',
        tileWidth: 32,
        tileHeight: 32,
      },
    );
    level.generate();

    const player = new Player(this, 300, 300);
    const cameraController = new CameraController(this, player.x, player.y);
    cameraController.follow(player);

    this.physics.add.collider(player, level.staticGroup);

    this.tweens.add({
      targets: logo,
      y: 350,
      duration: 500,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }

  update(){

  }
}
