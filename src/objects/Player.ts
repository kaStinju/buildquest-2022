import Phaser from 'phaser'

export default class Player extends Phaser.Physics.Arcade.Sprite {

  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  camera: Phaser.Cameras.Scene2D.Camera;

  moveSpeed = 300;

  movePull = 0.4;
  frictionPull = 0.3;
  cameraPull = 0.15;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, 'slime')
    this.camera = this.scene.cameras.main;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this)
    this.left = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.right = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.up = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.down = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
	}

  preUpdate() {
    // Movement
    const inputDir = new Phaser.Math.Vector2(
      (this.right.isDown ? 1 : 0) - (this.left.isDown ? 1 : 0),
      (this.down.isDown ? 1 : 0) - (this.up.isDown ? 1 : 0),
    );

    if (inputDir.lengthSq() > 0) {
      const oldVelocity = this.body.velocity;
      const targetVelocity = inputDir.scale(this.moveSpeed / inputDir.length());
      const newVelocity = oldVelocity.scale(1 - this.movePull)
        .add(targetVelocity.scale(this.movePull));
      this.setVelocity(newVelocity.x, newVelocity.y);
    } else {
      const oldVelocity = this.body.velocity;
      const newVelocity = oldVelocity.scale(1 - this.frictionPull);
      this.setVelocity(newVelocity.x, newVelocity.y);
    }

    // Camera follow
    const cameraTargetX = this.x - this.camera.width / 2;
    const cameraTargetY = this.y - this.camera.height / 2;

    this.camera.scrollX = this.camera.scrollX * (1 - this.cameraPull) +
      cameraTargetX * this.cameraPull;
    this.camera.scrollY = this.camera.scrollY * (1 - this.cameraPull) +
      cameraTargetY * this.cameraPull;
  }

	// ... other methods and actions
}
