import Phaser from 'phaser';
import Player from '../objects/Player';
//import Wall from '../objects/Wall';

export default class Demo extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.image('slime', 'assets/slime.png');
    this.load.image('wall', 'assets/wall.png');
  }

  create() {
    let wall;
    const logo = this.add.image(400, 70, 'logo');

    const player = new Player(this, 200, 200);


    //let wall = new Wall(this, 300, 300);
    wall = this.physics.add.staticGroup();
    wall.create(300, 300, 'wall')

    this.physics.add.collider(player, wall);

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
