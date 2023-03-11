class GameOverScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameOverScene'})
    }

    init(data) {
        console.log('init', data)
        this.final_score = data.score
    }

    create () { 
    
        this.final_score = 'You scored: ' + this.final_score
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 45, this.final_score, 
            {
                fontSize: '40px', 
                fill: '#fff', 
                fontFamily: 'Monogram'
        }).setOrigin(0.5).setAlign('center')

        var playAgain = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 10, 'PLAY AGAIN', 
            {
                fontSize: '80px', 
                fill: '#fff', 
                fontFamily: 'Monogram'
            }).setOrigin(0.5).setAlign('center')

        playAgain.setInteractive({ useHandCursor: true })
        
        playAgain.on('pointerdown', (pointer) => {
            playAgain.setStyle({fill: '#ff0000'}).setAlpha(0.75)
            this.scene.start('TitleScene')
        })

    }

}

export default GameOverScene