import Phaser from 'phaser'

export default class Wall extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x:number, y:number) {
    super(scene, x, y, 'wall')
    
  }
}