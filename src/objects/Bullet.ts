import Phaser from 'phaser'
import {getGameController} from '../control/GameController';
import Enemy from './Enemy';
import Entity from './Entity'

export default class Bullet extends Entity {

  angle: number;

	constructor(scene: Phaser.Scene, x: number, y: number, angle: number) {
		super(scene, x, y, 'bullet')
    this.moveSpeed = 600;
    this.angle = angle;
	}

  update() {
    const inputDir = new Phaser.Math.Vector2(Math.cos(this.angle), Math.sin(this.angle));
    this.move(inputDir);

    const gameController = getGameController();

    if (this.scene.physics.collide(this, gameController.enemyGroup, (_, other) => {
      const enemy = other as Enemy;
      // TODO: do something with enemy
    })) {
      this.destroy();
      return;
    };
    if (this.scene.physics.collide(this, gameController.levelManager.staticGroup)) {
      this.destroy();
      return;
    }
  }
}
