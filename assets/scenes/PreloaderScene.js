class PreloaderScene extends Phaser.Scene {
    constructor () {
        super({ key: 'PreloaderScene'})
    }

    preload () {
        var width = this.cameras.main.width
        var height = this.cameras.main.height

        var logoText = this.add.text(width / 2, height * 0.2, '[DINO RUSH]',
        {
            fontStyle: 'bold italic',
            fontSize: '80px', 
            fill: '#fff', 
            fontFamily: 'Monogram'
        }).setOrigin(0.5).setAlign('center')

        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics()
        progressBox.fillStyle(0x222222, 0.8)
        progressBox.fillRect(80, height / 2 + 50, height, 25)

        var title = this.make.text({
            x: width / 2,
            y: height / 2 + 10,
            text: 'Loading...',
            style: {
                font: '32px Monogram',
                fill: '#fff'
            }
        }).setOrigin(0.5, 0.5)
        var progressText = this.make.text({
            x: width / 2,
            y: height / 2 + 60,
            text: '0%',
            style: {
                font: '24px Monogram',
                fill: '#fff'
            }
        }).setOrigin(0.5, 0.5)

        this.load.on('progress', function (value) {
            console.log(value)
            progressText.setText(parseInt(value * 100) + '%')
            progressBar.clear()
            progressBar.fillStyle(0xffffff, 1).fillRect(85, height / 2 + 55, (height - 10) * value, 15)
        })

        this.load.on('fileprogress', function (file) {
            console.log(file.src);
            
        })

        this.load.on('complete', function () {
            console.log('complete')
            progressBar.destroy()
            progressBox.destroy()
            title.destroy()
            progressText.destroy()
            logoText.destroy()
        })

        // Load spritesheets, audio, etc.
        this.load.audio('bgMusic', ['assets/audio/Easy 8bit.mp3'])
        this.load.audio('steakSFX', ['assets/audio/Coin.wav'])
        this.load.audio('deathSFX', ['assets/audio/Death.wav'])
        this.load.audio('gameOverSFX', ['assets/audio/Game over Music.mp3'])
        this.load.image('sky', 'assets/images/sky.png')
        this.load.image('tiles', 'assets/tilesets/tileset.png')
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/map.json')
        this.load.image('steak', 'assets/images/steak.png')
        this.load.spritesheet('asteroid', 'assets/spritesheets/Asteroid 01 - Explode.png', {frameWidth: 96, frameHeight: 96})
        this.load.spritesheet('dino', 'assets/spritesheets/dino.png', {frameWidth: 24, frameHeight: 24})
        this.load.spritesheet('explosion', 'assets/spritesheets/enemy-deadth.png', {frameWidth: 40, frameHeight: 40})
        this.load.image('background', 'assets/images/blurry_background.png')
        this.load.image('inGameSoundOn', 'assets/images/soundOnButton.jpeg')
        this.load.image('inGameSoundOff', 'assets/images/soundOffButton.jpeg')
        this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true)
    }

    create () {
        this.scene.start('TitleScene')  
    }
  
}

export default PreloaderScene