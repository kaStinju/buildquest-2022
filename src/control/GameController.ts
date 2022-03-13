import Phaser from 'phaser'
import Bullet from '../objects/Bullet';
import Enemy from '../objects/Enemy';
import Player from '../objects/Player';
import CameraController from './CameraController';
import LevelManager from './LevelManager';

let gameController: GameController;

export function getGameController(): GameController {
  return gameController;
}

export default class GameController {

  updateGroup: Phaser.GameObjects.Group;
  enemyGroup: Phaser.GameObjects.Group;

  levelManager: LevelManager;
  cameraController: CameraController;
  player: Player;

  scene: Phaser.Scene;
  song: Phaser.Sound.BaseSound;

  score = 0;
  enemyCount = 0;

	constructor(scene: Phaser.Scene) {
    if (gameController) {
      throw new Error('game controller already exists');
    }

    gameController = this;

    this.scene = scene;
    this.updateGroup = this.scene.add.group([], { runChildUpdate: true });
    this.enemyGroup = this.scene.add.group();

    this.song = this.scene.sound.add("happy", { loop: true });
    this.song.play();

    this.levelManager = new LevelManager(
      this.scene,
      {
        roomsVertical: 5,
        roomsHorizontal: 5,
        roomWidth: 20,
        roomHeight: 15,
        doorWidth: 4,
        doorHeight: 4,
        fill: 0.25,
      },
      {
        image: 'tiles',
        tileWidth: 32,
        tileHeight: 32,
      },
    );
    this.levelManager.generate();

    const start = this.levelManager.getStart();
    this.player = new Player(this.scene, start.x, start.y);
    this.cameraController = new CameraController(
      this.scene,
      this.player.x,
      this.player.y,
    );
    this.cameraController.follow(this.player);

    this.updateGroup.add(this.player);
    this.updateGroup.add(this.cameraController);
    this.scene.physics.add.collider(this.player, this.levelManager.staticGroup);
	}

  onPoint() {
    this.player.moveSpeed += 10;
    this.score ++;

    if (this.score == this.enemyCount) {
      this.player.anims.play('monster');
      this.song.destroy();
    }
  }

  createBullet(x: number, y: number, angle: number) {
    const bullet = new Bullet(this.scene, x, y, angle);
    this.updateGroup.add(bullet);
  }

  createEnemy(x: number, y: number) {
    const enemy = new Enemy(this.scene, x, y);
    this.updateGroup.add(enemy);
    this.scene.physics.add.collider(enemy, this.levelManager.staticGroup);
    this.enemyGroup.add(enemy);
    this.enemyCount ++;
  }
}
