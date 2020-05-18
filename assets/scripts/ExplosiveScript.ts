const {ccclass, property} = cc._decorator;
import GameClass from './GameScript';
import PlayerClass from './PlayerScript';

@ccclass
export default class ExplosiveClass extends cc.Component {

    @property( cc.Prefab )
    flame : cc.Prefab = null;

    @property
    duration : number = 0.5;

    @property( { type : cc.AudioClip } )
    explosionSound : cc.AudioClip = null;

    timer : number = 0;
    player : PlayerClass;
    explosionRadius : number;

    gameScript : GameClass;

    explode = () => {
        let rightStop : boolean, leftStop : boolean, topStop : boolean, bottomStop : boolean = false;

        this.gameScript.bombsPlaced.delete( this.node.x + ', ' + this.node.y );
        this.player.numBombsPlaced -= 1;
        if( this.explosionSound ) cc.audioEngine.playEffect( this.explosionSound, false );
        this.node.destroy();

        let flame = cc.instantiate( this.flame );
        this.node.parent.addChild( flame, 2 );
        flame.setPosition( cc.v2( this.node.x , this.node.y ) );

        let offset : number;

        for( let i = 1; i <= this.explosionRadius; i++ ) {
            offset = this.node.x + this.node.width * i;
            if( ! rightStop ) {
                if( ( Math.abs( offset / this.node.width ) % 2 === 1 && Math.abs( this.node.y / this.node.height ) % 2 === 1 )
                        || offset > this.node.parent.width / 2 - this.node.width ) {
                    rightStop = true;
                }
                else {
                    if( ! this.gameScript.flamesPlaced.get( offset + ', ' + this.node.y ) ) {
                        this.gameScript.flamesPlaced.set( offset + ', ' + this.node.y, true );
                        let rightFlame = cc.instantiate( this.flame );
                        this.node.parent.addChild( rightFlame, 2 );
                        rightFlame.setPosition( cc.v2( offset, this.node.y ) );
                    }
                    if( this.gameScript.breakablesPlaced.get( offset + ', ' + this.node.y ) ) {
                        rightStop = true;
                    }
                }
            }

            offset = this.node.x - this.node.width * i;
            if( ! leftStop ) {
                if( ( Math.abs( offset / this.node.width ) % 2 === 1 && Math.abs( this.node.y / this.node.height ) % 2 === 1 )
                        || offset < - this.node.parent.width / 2 + this.node.width ) {
                    leftStop = true;
                }
                else {
                    if( ! this.gameScript.flamesPlaced.get( offset + ', ' + this.node.y ) ) {
                        this.gameScript.flamesPlaced.set( offset + ', ' + this.node.y, true );
                        let leftFlame = cc.instantiate( this.flame );
                        this.node.parent.addChild( leftFlame, 2 );
                        leftFlame.setPosition( cc.v2( offset, this.node.y ) );
                    }
                    if( this.gameScript.breakablesPlaced.get( offset + ', ' + this.node.y ) ) {
                        leftStop = true;
                    }
                }
            }

            offset = this.node.y + this.node.height * i;
            if( ! topStop ) {
                if( ( Math.abs( offset / this.node.height ) % 2 === 1 && Math.abs( this.node.x / this.node.width ) % 2 === 1 )
                        || offset > this.node.parent.height / 2 - this.node.height ) {
                    topStop = true;
                }
                else {
                    if( ! this.gameScript.flamesPlaced.get( this.node.x + ', ' + offset ) ) {
                        this.gameScript.flamesPlaced.set( this.node.x + ', ' + offset, true );
                        let topFlame = cc.instantiate( this.flame );
                        this.node.parent.addChild( topFlame, 2 );
                        topFlame.setPosition( cc.v2( this.node.x, offset ) );
                    }
                    if( this.gameScript.breakablesPlaced.get( this.node.x + ', ' + offset ) ) {
                        topStop = true;
                    }
                }
            }

            offset = this.node.y - this.node.height * i;
            if( ! bottomStop ) {
                if( ( Math.abs( offset / this.node.height ) % 2 === 1 && Math.abs( this.node.x / this.node.width ) % 2 === 1 )
                        || offset < - this.node.parent.height / 2 + this.node.width ) {
                    bottomStop = true;
                }
                else {
                    if( ! this.gameScript.flamesPlaced.get( this.node.x + ', ' + offset ) ) {
                        this.gameScript.flamesPlaced.set( this.node.x + ', ' + offset, true );
                        let bottomFlame = cc.instantiate( this.flame );
                        this.node.parent.addChild( bottomFlame, 2 );
                        bottomFlame.setPosition( cc.v2( this.node.x, offset ) );
                    }
                    if( this.gameScript.breakablesPlaced.get( this.node.x + ', ' + offset ) ) {
                        bottomStop = true;
                    }
                }
            }
        }
    }

    onLoad = () => {
        this.timer = 0;
        this.gameScript = this.node.parent.parent.getComponent( 'GameScript' );
    }

    update = ( dt : number ) => {
        this.timer += dt;
        if( this.timer >= this.duration ) {
            this.explode();
        }
    }
}
