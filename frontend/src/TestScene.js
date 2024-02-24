class TestScene extends Phaser.Scene {
    constructor() {
      super({ key: 'TestScene' });
    }
  
    create() {
      this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });
    }
  }
  