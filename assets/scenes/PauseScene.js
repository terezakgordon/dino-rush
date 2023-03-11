class PauseScene extends Phaser.Scene {
    constructor() {
        super({key: 'PauseScene'})
    }

    create () { 

        this.returnText = this.add.text(this.cameras.main.width / 2, 290, 'BACK TO GAME', 
            {
                fontSize: '60px', 
                fill: '#fff', 
                fontFamily: 'Monogram'
        }).setOrigin(0.5).setAlign('center')

        this.returnText.setInteractive({ cursor: 'pointer' })

        this.returnText.on('pointerdown', (pointer) => {
            this.returnText.setStyle({fill: '#ff0000'}).setAlpha(0.75)
            this.scene.resume('GameScene')
        })
    }

}

export default PauseScene