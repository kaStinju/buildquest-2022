import Phaser from 'phaser';
import Player from '../objects/Player';

export default class Demo extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.image('slime', 'assets/slime.png');
  }

  create() {
    const logo = this.add.image(400, 70, 'logo');

    const player = new Player(this, 200, 200);

    this.add.existing(player);

    this.tweens.add({
      targets: logo,
      y: 350,
      duration: 500,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }
}
