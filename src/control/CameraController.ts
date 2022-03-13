import Phaser from 'phaser'

interface Followee {
  x: number;
  y: number;
}

export default class CameraController extends Phaser.GameObjects.GameObject {

  camera: Phaser.Cameras.Scene2D.Camera;
  x: number;
  y: number;
  pull = 0.15;

  target: Followee | null = null;

	constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, "");
    scene.add.existing(this);
    this.x = x;
    this.y = y;
    this.camera = this.scene.cameras.main;
    this.camera.zoom = 1;
	}

  follow(followee: Followee | null) {
    this.target = followee;
  }

  update() {
    if (!this.target) {
      return;
    }

    this.x = this.x * (1 - this.pull) + this.target.x * this.pull;
    this.y = this.y * (1 - this.pull) + this.target.y * this.pull;

    this.camera.scrollX = Math.floor(this.x - this.camera.width / 2);
    this.camera.scrollY = Math.floor(this.y - this.camera.height / 2);
  }
}
