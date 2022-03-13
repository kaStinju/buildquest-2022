import Phaser from 'phaser'

export default class Entity extends Phaser.Physics.Arcade.Sprite {
  moveSpeed = 300;
  movePull = 0.4;
  frictionPull = 0.3;

	constructor(scene: Phaser.Scene, x: number, y: number, sprite: string) {
		super(scene, x, y, sprite);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
	}

  move(inputDir: Phaser.Math.Vector2) {
    if (inputDir.lengthSq() > 0) {
      const oldVelocity = this.body.velocity;
      const targetVelocity = inputDir.scale(this.moveSpeed);
      const newVelocity = oldVelocity.scale(1 - this.movePull)
        .add(targetVelocity.scale(this.movePull));
      this.setVelocity(newVelocity.x, newVelocity.y);
    } else {
      const oldVelocity = this.body.velocity;
      const newVelocity = oldVelocity.scale(1 - this.frictionPull);
      this.setVelocity(newVelocity.x, newVelocity.y);
    }
  }
}
