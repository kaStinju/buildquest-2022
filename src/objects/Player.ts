import Phaser from 'phaser'

export default class Player extends Phaser.GameObjects.Sprite {

  leftKey: Phaser.Input.Keyboard.Key;
  rightKey: Phaser.Input.Keyboard.Key;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, 'slime')
    this.leftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
	}

  preUpdate() {
    if (this.leftKey.isDown) {
      this.x -= 4;
    }
    if (this.rightKey.isDown) {
      this.x += 4;
    }
  }

	// ... other methods and actions
}

