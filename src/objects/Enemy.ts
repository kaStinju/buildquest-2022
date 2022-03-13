import Phaser from 'phaser'
import Entity from './Entity'

enum EnemyState {
  STILL,
  WALKING,
}

export default class Enemy extends Entity {

  state: EnemyState = EnemyState.STILL;
  timer: number = 60 * 3;
  angle: number = 0;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, 'enemy')
    this.moveSpeed = 75;

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: 'stand',
      frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.play('stand');
	}

  resetTimer() {
    if (this.state == EnemyState.STILL) {
      this.timer = Math.floor(60 * 8 + 60 * Math.random() * 3);
    }
    if (this.state == EnemyState.WALKING) {
      this.timer = Math.floor(60 * 1 + 60 * Math.random() * 3);
    }
  }

  updateTimer() {
    if (this.timer > 0) {
      this.timer -= 1;
      if (this.timer == 0) {
        this.toggleState();
        this.resetTimer();
      }
    }
  }

  toggleState() {
    if (this.state == EnemyState.STILL) {
      this.state = EnemyState.WALKING;
      this.anims.play('walk');
      this.angle = Math.random() * 2 * Math.PI;
      return;
    }

    if (this.state == EnemyState.WALKING) {
      this.state = EnemyState.STILL;
      this.anims.play('stand');
      return;
    }
  }

  update() {
    const inputDir = this.state == EnemyState.WALKING ?
      new Phaser.Math.Vector2(Math.cos(this.angle), Math.sin(this.angle)) :
      new Phaser.Math.Vector2(0, 0);

    this.move(inputDir);
    this.updateTimer();
  }
}
