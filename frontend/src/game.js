var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
var cursors;
var items;

function preload() {
    // Preload a placeholder image for items
    this.load.image('player', 'assets/player.png');
    this.load.image('playerShooting', 'assets/playerShooting.png');
    // this.load.image('item', 'assets/item-image.png'); // Ensure you have an image at this path
    this.load.image('cannonball', 'assets/cannonball.png'); // Make sure the path and filename are correct
    // this.load.image('refillPad', 'assets/refill-pad-image.png'); // Ensure you have an image for the refill pad

}


function refillCannonballs(player, pad) {
    pad.disableBody(true, true); // Despawn the refill pad
    cannonballs = maxCannonballs; // Assuming 'cannonballs' is your variable tracking the count
}


function create() {
    this.cameras.main.setBackgroundColor(0x0000FF); // Blue background

    // Set world bounds larger than the default camera viewport
    this.physics.world.bounds.width = 1600;
    this.physics.world.bounds.height = 1200;

    // Create the player sprite
    player = this.physics.add.sprite(400, 300, 'player').setOrigin(0.5, 0.5);
    player.setScale(.1)
    player.body.setCollideWorldBounds(true);

    // Camera to follow the player
    this.cameras.main.startFollow(player, true, 0.05, 0.05);
    this.cameras.main.setZoom(1);

    // Setup keyboard controls
    cursors = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Create items group and spawn random items
    items = this.physics.add.group();
    for (let i = 0; i < 50; i++) {
        const x = Phaser.Math.Between(0, this.physics.world.bounds.width);
        const y = Phaser.Math.Between(0, this.physics.world.bounds.height);
        items.create(x, y, 'item');
    }

    // Cannonballs group
    cannonballs = this.physics.add.group({
        defaultKey: 'cannonball',
        maxSize: 10 // Adjust as needed
    });

    // Mouse click event to shoot
    this.input.on('pointerdown', function (pointer) {
        // Change player's texture to shooting
        player.setTexture('playerShooting');

        // Shoot the cannonball
        shootCannonball.call(this, pointer);

        // Set a timed event to revert the player's texture back after 500 milliseconds
        this.time.delayedCall(500, function() {
            player.setTexture('player');
        }, [], this);
    }, this);

    // Refill pad
    var refillPads = this.physics.add.group({
        key: 'refill_pad',
        repeat: 5, // Adjust based on how many pads you want
        setXY: { x: 100, y: 100, stepX: 200, stepY: 200 } // Adjust positions as needed
    });    
    this.physics.add.overlap(player, refillPads, function (player, pad) {
        pad.disableBody(true, true); // Hide and disable the pad
        // Replenish the player's cannonballs
        cannonballs.children.iterate(function (child) {
            child.setActive(false).setVisible(false); // Deactivate all cannonballs
            child.body.enable = false;
        });
        // Optionally reset the cannonball count or logic here if necessary
    });
    
}

function shootCannonball(pointer) {
    var worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    var cannonball = cannonballs.get(player.x, player.y);
    cannonball.setScale(.05)
    cannonball.body.enable = true; // Re-enable the physics body
    if (cannonball) {
        cannonball.setActive(true).setVisible(true);
        var angle = Phaser.Math.Angle.Between(player.x, player.y, worldPoint.x, worldPoint.y);
        this.physics.velocityFromRotation(angle, 400, cannonball.body.velocity); // Adjust speed as needed
        cannonball.rotation = angle;
    }
}

function update() {
    player.body.setVelocity(0);

    if (cursors.left.isDown) {
        player.body.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(160);
    }

    if (cursors.up.isDown) {
        player.body.setVelocityY(-160);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(160);
    }

    // Rotate player to face the mouse cursor
    var pointer = this.input.activePointer;
    var angle = Phaser.Math.Angle.Between(player.x, player.y, pointer.worldX, pointer.worldY);
    player.rotation = angle + Math.PI / 2; // Adjust for sprite orientation
}

