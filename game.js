import TitleScene from './assets/scenes/TitleScene.js'
import GameScene from './assets/scenes/GameScene.js'
import GameOverScene from './assets/scenes/GameOverScene.js'
import PreloaderScene from './assets/scenes/PreloaderScene.js'
import Model from './Model.js'
import CreditsScene from './assets/scenes/CreditsScene.js'
import PauseScene from './assets/scenes/PauseScene.js'

var config = {
    type: Phaser.AUTO,
    title: 'Dino Rush',
    width: 480,
    height: 320,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 250},
        }
    },
    render: {
        pixelArt: true
    },
}

var game = new Phaser.Game(config)

const model = new Model();
game.globals = { 
    model, 
    bgMusic: null, 
    steakSFX: null,
    deathSFX: null,
    gameOverSFX: null
 };

game.scene.add('PreloaderScene', PreloaderScene)
game.scene.add('TitleScene', TitleScene)
game.scene.add('CreditsScene', CreditsScene)
game.scene.add('GameScene', GameScene)
game.scene.add('PauseScene', PauseScene)
game.scene.add('GameOverScene', GameOverScene)

game.scene.start('PreloaderScene')