class TitleScene extends Phaser.Scene {
    constructor() {
        super({key: 'TitleScene'})
    }

    create () { 
        // this.sound.pauseOnBlur = false
        this.add.image(0, 0, 'background').setOrigin(0,0)

        this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.2, '[DINO RUSH]',
        {
            fontStyle: 'bold italic',
            fontSize: '80px', 
            fill: '#000', 
            fontFamily: 'Monogram'
        }).setOrigin(0.5).setAlign('center')

        this.playButton = this.makeTitle(0, 'PLAY')
        this.creditsButton = this.makeTitle(50, 'CREDITS')

        this.playButton.setInteractive({ cursor: 'pointer' })
        this.creditsButton.setInteractive({ cursor: 'pointer' })

        this.playButton.on('pointerdown', (pointer) => {
            this.scene.start('GameScene')
        })

        this.creditsButton.on('pointerdown', (pointer) => {
            this.scene.start('CreditsScene')
        })  

        this.bgMusic = this.sound.add('bgMusic', { volume: 0.25, loop: true })

        this.model = this.sys.game.globals.model;
        if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
            this.model.bgMusicPlaying = true;
            
            // this.bgMusic.play();

            if (!this.sound.locked) {
                // already unlocked so play
                this.bgMusic.play();
            } else {
                // wait for 'unlocked' to fire and then play
                this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
                    // this.music.play()
                    this.bgMusic.play();
                })
            }
            this.sys.game.globals.bgMusic = this.bgMusic

        }

    }

    makeTitle(y, text){
        var y1 = this.cameras.main.height / 2.25

        var title = this.add.text(this.cameras.main.width / 2, y + y1, text, 
        {
            fontSize: '60px', 
            fill: '#000', 
            fontFamily: 'Monogram'
        }).setOrigin(0.5).setAlign('center')

        return title
    }

}

export default TitleScene