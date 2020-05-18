import PlayerClass from "./PlayerScript";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BombButtonClass extends cc.Component {

    playerScript : PlayerClass;

    onTouchStart = ( e ) => {
        e.stopPropagation();

        this.playerScript.attemptBombPlacement();
    }

    getPlayerScript = () => {
        this.playerScript = this.node.parent.getComponent( 'GameScript' ).playerInstance.getComponent( 'PlayerScript' );
    }

    start = () => {
        this.getPlayerScript();

        this.node.on( cc.Node.EventType.TOUCH_START, this.onTouchStart );
    }
}
