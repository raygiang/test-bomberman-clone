const {ccclass, property} = cc._decorator;
import GameClass from './GameScript';

@ccclass
export default class NewClass extends cc.Component {

    @property
    duration : number = 0.6;

    timer = 0;

    gameScript : GameClass;

    onCollisionEnter = ( other : cc.Collider, self : cc.Collider ) => {
        if( other.node.group === 'breakable' ) {
            other.node.getComponent( 'BreakableScript' ).removeBreakable();
            this.gameScript.breakablesPlaced.delete( this.node.x + ', ' + this.node.y );
        }
        else if( other.node.group === 'explosive' ) {
            other.node.getComponent( 'ExplosiveScript' ).explode();
        }
    }

    onLoad = () => {
        this.gameScript = this.node.parent.parent.getComponent( 'GameScript' );
    }

    update ( dt : number ) {
        this.timer += dt;
        
        if( this.timer > this.duration ) {
            this.gameScript.flamesPlaced.delete( this.node.x + ', ' + this.node.y );
            this.node.destroy();
        }
    }
}
