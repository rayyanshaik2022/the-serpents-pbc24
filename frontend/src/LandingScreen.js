import Phaser from 'phaser';



export class LandingScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'LandingScreen' });
    }

    preload() {
        // Load any assets needed for the landing screen
    }

    create() {
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Ship Adventure!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Click to Start', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        this.input.on('pointerdown', () => {
            this.scene.start('MainGame');
        });
    }
}
