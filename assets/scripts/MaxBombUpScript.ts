const {ccclass, property} = cc._decorator;

@ccclass
export default class MaxBombUpClass extends cc.Component {

    @property
    immunityDuration : number = 0.61;

    @property( { type : cc.AudioClip } )
    powerUpSound : cc.AudioClip = null;

    timer = 0;

    onCollisionEnter = ( other : cc.Collider, self : cc.Collider ) => {
        if( other.node.group === 'player' ) {
            let playerScript = other.node.getComponent( 'PlayerScript' );
            if( playerScript.maxBombs < 8 ) playerScript.maxBombs += 1;
            if( this.powerUpSound ) cc.audioEngine.playEffect( this.powerUpSound, false );
            this.node.destroy();
        }
        else if( this.timer > this.immunityDuration && other.node.group === 'danger' ) {
            this.node.destroy();
        }
    }

    update ( dt : number ) {
        this.timer += dt;
    }
}
