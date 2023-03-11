class CreditsScene extends Phaser.Scene {
    constructor() {
        super({key: 'CreditsScene'})
    }

    create () { 
        
        var y1 = this.cameras.main.height / 2.25

        this.text = this.add.text(this.cameras.main.width / 2, 50, 'Credits', 
            { 
                fontSize: '60px', 
                fill: '#fff', 
                fontFamily: 'Monogram'
            }).setOrigin(0.5).setAlign('center')

        var credits = [
            // "Artwork",
            "Steak: Crafting Materials by Beast Pixels",
            "Tileset: Sunny Land by Ansimuz",
            "Sky: Legacy Fantasy Game Asset by Anokolisa",
            "Characters: Dino Characters by @ScissorsMarks (Twitter)",
            "Asteroid: Asteroid by Foozle (www.foozle.io)",
            "Buttons: Pixel UI Pack by Kenney Vleugels (www.kenney.nl)",
            "Music: Easy 8bit by Simba Chinomona",
            "Font: monogram by Datagoblin"
        ]

        this.menuText = this.add.text(this.cameras.main.width / 2, 165, credits, 
            {
                fontSize: '20px', 
                fill: '#fff', 
                fontFamily: 'Monogram'
        }).setOrigin(0.5).setAlign('center')
        

        this.menuText = this.add.text(this.cameras.main.width / 2, 270, 'BACK TO MENU', 
            {
                fontSize: '60px', 
                fill: '#fff', 
                fontFamily: 'Monogram'
        }).setOrigin(0.5).setAlign('center')

        this.menuText.setInteractive({ cursor: 'pointer' })

        this.menuText.on('pointerdown', (pointer) => {
            this.menuText.setStyle({fill: '#ff0000'}).setAlpha(0.75)
            this.scene.start('TitleScene')
        })
    }

}

export default CreditsScene