import JoystickClass from "./JoystickScript";
import BombButtonClass from "./BombButtonScript";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameClass extends cc.Component {

    @property( cc.Prefab )
    player : cc.Prefab = null;

    @property( cc.Prefab )
    block : cc.Prefab = null;

    @property( cc.Prefab )
    breakable : cc.Prefab = null;

    gameWidth : number;
    blockWidth : number;

    breakablesPlaced : Map<string, boolean> = new Map();
    bombsPlaced : Map<string, boolean> = new Map();
    flamesPlaced : Map<string, boolean> = new Map();

    gameContainer : cc.Node;
    playerInstance : cc.Node;

    joystickScript : JoystickClass;
    bombButtonScript : BombButtonClass;

    placeBaseBlocks = () => {
        if( this.block === null ) return;

        // Place the blocks to form a basic stage
        for( let i = 0; i < 15; i++ ) {
            for( let j = 0; j < 15; j++ ) {
                if( i === 0 || i === 14 || j === 0 || j === 14 || ( j % 2 === 0 && i % 2 === 0 ) ) {
                    let newBlock = cc.instantiate( this.block );
                    this.gameContainer.addChild( newBlock, 3 );
                    
                    let xPos = - this.gameContainer.width / 2 + newBlock.width / 2 + ( i * newBlock.width );
                    let yPos = this.gameContainer.height / 2 - newBlock.height / 2 - ( j * newBlock.height );
                    newBlock.setPosition( cc.v2( xPos, yPos ) );
                }
            }
        }
    }

    // Place the breakable obstacles on the stage
    placeBreakables = () => {
        if( this.breakable === null ) return;

        for( let i = 1; i < 14; i++ ) {
            for( let j = 1; j < 14; j++ ) {
                // Avoid spawn spots and places with blocks
                if( ! ( i < 3 && j < 3 ) && ! ( i > 11 && j < 3 ) && ! ( i < 3 && j > 11 ) && ! ( i > 11 && j > 11 )
                        && ! ( j % 2 === 0 && i % 2 === 0 ) ) {
                    if( Math.random() < 0.75 ) {
                        let newBreakable = cc.instantiate( this.breakable );
                        let xPos = - this.gameContainer.width / 2 + newBreakable.width / 2 + ( i * newBreakable.width );
                        let yPos = this.gameContainer.height / 2 - newBreakable.height / 2 - ( j * newBreakable.height );
                        
                        this.gameContainer.addChild( newBreakable, 1 );
                        newBreakable.setPosition( cc.v2( xPos, yPos ) );
                        this.breakablesPlaced.set( xPos + ', ' + yPos, true );
                    }
                }
            }
        }
    }
    
    // Place Players
    placePlayers = () => {
        if( this.player === null ) return;

        this.playerInstance = cc.instantiate( this.player );
        this.gameContainer.addChild( this.playerInstance, 5 );
        
        let xPos = - this.gameContainer.width / 2 + this.blockWidth + this.playerInstance.width / 2;
        let yPos = this.gameContainer.height / 2 - this.blockWidth - this.playerInstance.height / 2;
        this.playerInstance.setPosition( cc.v2( xPos, yPos ) );
    }

    startNewGame = () => {
        this.gameContainer = this.node.getChildByName( 'Game Container' );
        this.gameContainer.removeAllChildren();
        this.gameWidth = this.gameContainer.width;
        this.blockWidth = this.gameWidth / 15;

        this.breakablesPlaced.clear();
        this.bombsPlaced.clear();
        this.flamesPlaced.clear();

        this.placeBaseBlocks();
        this.placeBreakables();
        this.placePlayers();

        this.joystickScript.getPlayerScript();
        this.bombButtonScript.getPlayerScript();
    }

    start = () => {
        this.joystickScript = this.node.getChildByName( 'Joystick' ).getComponent( 'JoystickScript' );
        this.bombButtonScript = this.node.getChildByName( 'BombButton' ).getComponent( 'BombButtonScript' );

        this.startNewGame();
    }
}
