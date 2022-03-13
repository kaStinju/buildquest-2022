import Phaser from 'phaser'
import {getGameController} from '../control/GameController';
import Bullet from './Bullet';
import Entity from './Entity'

export default class Player extends Entity {

  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;


  shootCooldown: number = 0;

	constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
		super(scene, x, y, 'playerForward')

    this.anims.create({
      key: 'forward',
      frames: this.anims.generateFrameNumbers('playerForward', { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: 'back',
      frames: this.anims.generateFrameNumbers('playerBack', { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: 'side',
      frames: this.anims.generateFrameNumbers('playerSide', { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: 'forwardIdle',
      frames: this.anims.generateFrameNumbers('playerForward', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: 'backIdle',
      frames: this.anims.generateFrameNumbers('playerBack', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: 'sideIdle',
      frames: this.anims.generateFrameNumbers('playerSide', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1,
    });

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this)

    this.left = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.right = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.up = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.down = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
	}

  getAngle(): number {
    return new Phaser.Math.Vector2(
      this.scene.input.activePointer.x + this.scene.cameras.main.scrollX - this.x,
      this.scene.input.activePointer.y + this.scene.cameras.main.scrollY - this.y,
    ).angle();
  }

  lookTowardsMouse(idle: boolean) {
    const angle = this.getAngle();
    this.flipX = false;
    if (angle > (Math.PI / 4) && angle < (3 * Math.PI / 4)) {
      this.anims.play('forward' + (idle ? 'Idle' : ''), true);
    } else if (angle > (3 * Math.PI / 4) && angle < (5 * Math.PI / 4)) {
      this.anims.play('side' + (idle ? 'Idle' : ''), true);
      this.flipX = true;
    } else if (angle > (5 * Math.PI / 4) && angle < (7 * Math.PI / 4)) {
      this.anims.play('back' + (idle ? 'Idle' : ''), true);
    } else {
      this.anims.play('side' + (idle ? 'Idle' : ''), true);
    }
  }
  
  shoot() {
    const gameController = getGameController();
    const angle = this.getAngle();
    gameController.createBullet(this.x, this.y, angle);
  }

  handleShooting() {
    if (this.shootCooldown != 0) {
      this.shootCooldown --;
      return;
    }
    if (this.scene.input.activePointer.isDown) {
      this.shoot();
      this.shootCooldown = 15;
    }
  }

  update() {
    const rawInput = new Phaser.Math.Vector2(
      (this.right.isDown ? 1 : 0) - (this.left.isDown ? 1 : 0),
      (this.down.isDown ? 1 : 0) - (this.up.isDown ? 1 : 0),
    );

    const idle = rawInput.lengthSq() == 0;

    const inputDir = idle ? rawInput : rawInput.normalize();

    this.move(inputDir);

    this.lookTowardsMouse(idle);

    this.handleShooting();
  }
}
