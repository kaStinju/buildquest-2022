import Phaser from 'phaser'

export default class Player extends Phaser.Physics.Arcade.Sprite {

  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  moveSpeed: number

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, 'slime')
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this)
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
    this.left = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.right = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.up = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.down = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.moveSpeed = 100;
	}

  preUpdate() {
    let dx = 0;
    let dy = 0;
    if (this.left.isDown) {
      dx -= 1;
    }
    if (this.right.isDown) {
      dx += 1;
    }
    if (this.up.isDown) {
      dy -= 1;
    }
    if (this.down.isDown) {
      dy += 1;
    }
    const magnitude = Math.sqrt(dx*dx + dy*dy);

    if (magnitude > 0) {
      dx /= magnitude;
      dy /= magnitude;

      this.setVelocityX(this.moveSpeed * dx);
      this.setVelocityY(this.moveSpeed * dy);
    } else {
      this.setVelocityX(0)
      this.setVelocityY(0)
    }
  }

	// ... other methods and actions
  update() {
    
  }
}
