import Phaser from 'phaser'
import Entity from './Entity'

export default class Enemy extends Entity {

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, 'enemy')
	}

  preUpdate() {
    this.move(new Phaser.Math.Vector2(0, 0));
  }
}
