import Phaser from 'phaser'
import {getGameController} from '../control/GameController';
import Enemy from './Enemy';
import Entity from './Entity'

export default class Bullet extends Entity {

  hit: Phaser.Sound.BaseSound;

	constructor(scene: Phaser.Scene, x: number, y: number, angle: number) {
		super(scene, x, y, 'bullet')
    this.hit = this.scene.sound.add("hit", { loop: false });
    this.moveSpeed = 900;
    this.rotation = angle;
	}

  update() {
    const inputDir = new Phaser.Math.Vector2(Math.cos(this.rotation), Math.sin(this.rotation));
    this.move(inputDir);

    const gameController = getGameController();

    if (this.scene.physics.collide(this, gameController.enemyGroup, (_, other) => {
      const enemy = other as Enemy;
      gameController.scene.add.sprite(enemy.x, enemy.y, 'splat');
      enemy.destroy();
    })) {
      gameController.onPoint();
      this.hit.play();
      this.destroy();
      return;
    };
    if (this.scene.physics.collide(this, gameController.levelManager.staticGroup)) {
      this.destroy();
      return;
    }
  }
}
