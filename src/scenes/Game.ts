import Phaser from 'phaser';
import GameController from '../control/GameController';

export default class Demo extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.audio('hit', 'assets/hit.mp3')
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.image('slime', 'assets/slime.png');
    this.load.image('tiles', 'assets/tileset.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.image('bullet', 'assets/bullet.png');
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
    new GameController(this);
  }
}
