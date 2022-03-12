import Phaser, { Physics } from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#000000',
  antialias: false,
  scale: {
    width: 800,
    height: 400,
    mode: Phaser.Scale.NO_ZOOM,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      
    },
  }
};
