class GameScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameScene'})
    }

    init () {
        this.score = 0
        this.scoreText = 0
        this.gameOver = false
        this.steakSFX = this.sound.add('steakSFX', { volume: 0.1 })
        this.deathSFX = this.sound.add('deathSFX', { volume: 0.5 })
        this.gameOverSFX = this.sound.add('gameOverSFX', { volume: 0.25 })

        this.sys.game.globals.steakSFX = this.steakSFX
        this.sys.game.globals.deathSFX = this.deathSFX
        this.sys.game.globals.gameOverSFX = this.gameOverSFX
    }
   
    create () {
        this.add.image(0, 0, 'sky').setOrigin(0,0).setScale(1.25, 1.25)

        this.model = this.sys.game.globals.model;

        this.soundOnButton = this.add.image(430, 30, 'inGameSoundOn').setOrigin(0,0).setScale(1.25, 1.25)
        this.soundOnButton.setInteractive( {cursor: 'pointer'} )

        const updateAudioOnClick = (property) => {
            return function () {
                this.model[property] = !this.model[property]
                this.updateAudio()
            }.bind(this)
        }

        this.soundOnButton.on('pointerdown', updateAudioOnClick("musicOn"))
        this.updateAudio()
    
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('tileset', 'tiles');    
            
        this.platforms = map.createLayer('platforms', tileset, 0, 0)
        const grass = map.createLayer('grass', tileset, 0, 0)
    
        //Adding in the sprite at the spawn point
        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point")
        this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'dino').setScale(1.25, 1.25)
        this.player.setBounce(0.2)
        this.player.setCollideWorldBounds(true)
        this.player.body.setSize(15, 17, 9, 7)
    
        this.platforms.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player, this.platforms)

        // Splitting up the sprite sheet for the different animations
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('dino', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
    
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('dino', { start: 4, end: 10}),
            frameRate: 14,
            repeat: -1
        }) 
    
        this.anims.create({
            key: 'asteroidIdle',
            frames: this.anims.generateFrameNumbers('asteroid', { frames: [0] }),
            repeat: -1
        })

        this.anims.create({
            key: 'asteroidExplosion',
            frames: this.anims.generateFrameNumbers('asteroid', { start: 1, end: 7}),
            frameRate: 16
        })

        this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNumbers('explosion'),
            frameRate: 12
        })

        // Method to start listening to keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();

        this.joystick = this.createJoystick(420, 260) 
        this.joystick2 = this.createJoystick(40, 260)
        

        // Creating a group for the steaks
        this.steaks = this.physics.add.group ({
            key: 'steak',
            repeat: 6,
            setXY: {x: 35, y: 0, stepX: 60}
        })
    
        this.steaks.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        });

    
        this.physics.add.collider(this.steaks,this.platforms)
        this.physics.add.overlap(this.player, this.steaks, this.collectSteak, null, this);
    
        this.scoreText = this.add.text(32, 16, 'score: 0', 
            {
                fontSize: '36px', 
                fill: '#000', 
                fontFamily: 'Monogram'
            }).setOrigin(0, 0)
    
        this.asteroids = this.physics.add.group()
        this.physics.add.collider(this.asteroids, this.asteroids)
        this.physics.add.collider(this.asteroids, this.platforms)
        this.physics.add.collider(this.player, this.asteroids, this.hitAsteroid, null, this)

        this.input.on('pointerdown', () => {
            this.isPointerDown = true;
          });
          
          this.input.on('pointerup', () => {
            this.isPointerDown = false;
          });

    }
    
    update () {
        if (this.gameOver) {
            this.time.delayedCall(1500, function () { this.scene.start('GameOverScene', { score: this.score }) }, [], this);
        }

        if (this.isTouchDevice()) {
            // device is touch enabled

            if (this.joystick.force) {
                this.joystickControl(this.joystick)
            } else if (this.joystick2.force) {
                this.joystickControl(this.joystick2)
            } else {
                this.player.anims.play('idle', true)
                this.player.setVelocityX(0)
            }


        } else {
            // device is not touch enabled
            this.joystick.thumb.setAlpha(0)
            this.joystick.base.setAlpha(0)

            this.joystick2.thumb.setAlpha(0)
            this.joystick2.base.setAlpha(0)

            // Keyboard controls
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-160)
                this.player.flipX = true
                this.player.anims.play('run', true)
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(160)
                this.player.flipX = false
                this.player.anims.play('run', true)
            } else { 
                // If no key is pressed
                this.player.setVelocityX(0)
                this.player.anims.play('idle', true)
            } 

            if (this.cursors.up.isDown && this.player.body.blocked) {
                // Set the speed you can jump
                this.player.setVelocityY(-125);
            }
        }
        
    }
    
    collectSteak (player, steak) {
        steak.disableBody(true, true);
    
        this.steakSFX.play()

        this.score += 10
        this.scoreText.setText('score: ' + this.score)
    
        if (this.steaks.countActive(true) == 0) {
            this.steaks.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true)
            })
        }

        // Make the asteroid spawn after every 2 steaks
        if (this.steaks.countActive(true) % 2 == 0) {
            var x = (player.x < 280) ? Phaser.Math.Between(280, 480) : Phaser.Math.Between(0, 280);
    
            this.asteroid = this.asteroids.create(x, 16, 'asteroid').setScale(0.85, 0.85).setSize(96 - 2 * 29, 96 - 32 - 31, 29, 32)
            this.asteroid.anims.play('asteroidIdle')
            this.asteroid.setBounce(1);
            this.asteroid.setCollideWorldBounds(true)
            this.asteroid.setVelocity(Phaser.Math.Between(-200, 200), 20)
        }

        this.time.delayedCall(150000, function () { this.asteroid.destroy() }, [], this);
        
    }
    
    hitAsteroid (player, asteroid) {
        this.cameras.main.zoom = 1.15
        this.cameras.main.shake(1000, 0.1)
        this.cameras.main.on('camerashakecomplete', () => {
            this.cameras.main.zoom = 1
        })

        this.player.setTint(0xff0000).setAlpha(0.75)
        const explosion = this.add.sprite(this.player.x, this.player.y, 'explosion')
        explosion.setScale(12.5, 12.5)
        explosion.anims.play('explosion')
        this.cameras.main.fade(750, 255, 255, 255)
        
        // this.player.anims.play('dead', true)
        this.physics.pause()

        this.tweens.add({
            targets: asteroid,
            scaleX: 5,
            scaleY: 5,
            ease: 'Power1',
            duration: 400,
        })

        asteroid.anims.play('asteroidExplosion').setScale(3, 3)
        this.deathSFX.play()

        this.deathSFX.on('complete', () => {
            this.gameOverSFX.play()
            this.gameOver = true
        })
        
    }

    joystickControl(joystick) {
            let speedMultiplier = (joystick.force < joystick.radius) ? joystick.force / joystick.radius : 1
            let speed = speedMultiplier * 160

            // Move the player horizontally
            if (joystick.left) {
                this.player.setVelocityX(-speed)
                this.player.flipX = true
                this.player.anims.play('run', true)
            } else if (joystick.right) {
                this.player.setVelocityX(speed)
                this.player.flipX = false
                this.player.anims.play('run', true)
            } else {
                this.player.anims.play('idle', true)
                this.player.setVelocityX(0)
                this.player.setVelocityY(0)
            }

            // Move the player vertically
            if (joystick.up && this.player.body.blocked) {
                this.player.setVelocityY(-speed)
            } 

    }

    createJoystick(x, y) {
        var joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: x,
            y: y,
            radius: 50,
            forceMin: 16,
            base: this.add.circle(0, 0, 50, 0x888888).setDepth(100).setAlpha(0.001),
            thumb: this.add.circle(0, 0, 30, 0xcccccc).setDepth(100).setAlpha(0.001)
        }).on('update', () => {}, this)

        return joystick
    }

    updateAudio() {
        if (this.model.musicOn === false) {
            this.soundOnButton.setTexture('inGameSoundOff');
            this.sys.game.globals.bgMusic.pause();
            this.steakSFX.setMute(true)
            this.deathSFX.setMute(true)
            this.gameOverSFX.setMute(true)
            this.model.bgMusicPlaying = false;
        } else {
            this.soundOnButton.setTexture('inGameSoundOn');
            if (this.model.bgMusicPlaying === false) {
                this.sys.game.globals.bgMusic.resume()
                this.steakSFX.setMute(false)
                this.deathSFX.setMute(false)
                this.gameOverSFX.setMute(false)
                this.model.bgMusicPlaying = true;
            }
        }
    }

    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints;
    }

}

export default GameScene