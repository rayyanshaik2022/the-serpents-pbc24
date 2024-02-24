import Phaser from 'phaser';


export class MainGame extends Phaser.Scene {
    constructor() {
        super({ key: 'MainGame' });
    }

    preload() {
        this.load.image('player', 'public/assets/player.png');
        this.load.image('playerShooting', 'public/assets/playerShooting.png');
        // this.load.image('item', 'assets/item-image.png');
        this.load.image('cannonball', 'public/assets/cannonball.png');
        // this.load.image('refillPad', 'assets/refill-pad-image.png');
    }

    create() {
        this.cameras.main.setBackgroundColor(0x0000FF);

        this.physics.world.bounds.width = 1600;
        this.physics.world.bounds.height = 1200;

        this.player = this.physics.add.sprite(400, 300, 'player').setOrigin(0.5, 0.5).setScale(.1);
        this.player.body.setCollideWorldBounds(true);

        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cameras.main.setZoom(1);

        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.items = this.physics.add.group();
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, this.physics.world.bounds.width);
            const y = Phaser.Math.Between(0, this.physics.world.bounds.height);
            this.items.create(x, y, 'item');
        }

        this.cannonballs = this.physics.add.group({
            defaultKey: 'cannonball',
            maxSize: 10
        });

        this.input.on('pointerdown', (pointer) => {
            this.player.setTexture('playerShooting');
            this.shootCannonball(pointer);

            this.time.delayedCall(500, () => {
                this.player.setTexture('player');
            });
        });

        var refillPads = this.physics.add.staticGroup({
            key: 'refillPad',
            repeat: 5,
            setXY: { x: 100, y: 100, stepX: 200, stepY: 200 }
        });

        this.physics.add.overlap(this.player, refillPads, (player, pad) => {
            pad.disableBody(true, true); // Hide and disable the pad
            // Replenish the player's cannonballs
            this.cannonballs.children.iterate((child) => {
                child.setActive(false).setVisible(false); // Deactivate all cannonballs
                child.body.enable = false;
            });
            // Optionally reset the cannonball count or logic here if necessary
        });
    }

    shootCannonball(pointer) {
        var cannonball = this.cannonballs.get(this.player.x, this.player.y);
        if (cannonball) {
            cannonball.setScale(.1);
            cannonball.body.enable = true;
            cannonball.setActive(true).setVisible(true);

            var angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.worldX, pointer.worldY);
            this.physics.velocityFromRotation(angle, 400, cannonball.body.velocity);
            cannonball.rotation = angle;
        }
    }

    update() {
        this.player.body.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(160);
        }

        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(160);
        }

        var pointer = this.input.activePointer;
        var angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.worldX, pointer.worldY);
        this.player.rotation = angle + Math.PI / 2; // Adjust based on sprite orientation
    }
}
