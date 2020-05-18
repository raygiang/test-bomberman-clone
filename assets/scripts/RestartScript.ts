import GameClass from "./GameScript";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RestartButtonClass extends cc.Component {

    gameScript : GameClass;

    onTouchStart = ( e ) => {
        e.stopPropagation();

        this.gameScript.startNewGame();
    }

    start = () => {
        this.gameScript = this.node.parent.getComponent( 'GameScript' );

        this.node.on( cc.Node.EventType.TOUCH_START, this.onTouchStart );
    }
}
