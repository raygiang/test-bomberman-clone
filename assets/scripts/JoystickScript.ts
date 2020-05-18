import PlayerClass from "./PlayerScript";

const {ccclass, property} = cc._decorator;

@ccclass
export default class JoystickClass extends cc.Component {

    initialX : number;
    initialY : number;
    playerScript : PlayerClass;

    stopAnimations = () => {
        this.playerScript.rightAnimation.pause();
        this.playerScript.leftAnimation.pause();
        this.playerScript.upAnimation.pause();
        this.playerScript.downAnimation.pause();
    }

    findFacingDirection = ( currX : number, currY : number ) => {
        this.stopAnimations();

        let dist = cc.v2( this.initialX, this.initialY ).sub( cc.v2( currX, currY ) );
        
        if( Math.abs( dist.x ) >= Math.abs( dist.y ) ) {
            if( dist.x < 0 ) {
                this.playerScript.rightAnimation.play();
            }
            else {
                this.playerScript.leftAnimation.play();
            }
        }
        else {
            if( dist.y < 0 ) {
                this.playerScript.upAnimation.play();
            }
            else {
                this.playerScript.downAnimation.play();
            }
        }
    }

    onTouchStart = ( e ) => {
        e.stopPropagation();

        let touchPosition = e.currentTouch._point;

        this.initialX = touchPosition.x;
        this.initialY = touchPosition.y;

        this.playerScript.joystickOn = true;
    }

    onTouchMove = ( e ) => {
        e.stopPropagation();

        if( this.initialX && this.initialY ) {
            let touchPosition = e.currentTouch._point;

            if( touchPosition.x > this.initialX ) {
                this.playerScript.keysPressed.set( cc.macro.KEY.right, true );
                this.playerScript.keysPressed.delete( cc.macro.KEY.left );
                this.findFacingDirection( touchPosition.x, touchPosition.y );
            }
            if( touchPosition.x < this.initialX ) {
                this.playerScript.keysPressed.set( cc.macro.KEY.left, true );
                this.playerScript.keysPressed.delete( cc.macro.KEY.right );
                this.findFacingDirection( touchPosition.x, touchPosition.y );
            }
            if( touchPosition.y > this.initialY ) {
                this.playerScript.keysPressed.set( cc.macro.KEY.up, true );
                this.playerScript.keysPressed.delete( cc.macro.KEY.down );
                this.findFacingDirection( touchPosition.x, touchPosition.y );
            }
            if( touchPosition.y < this.initialY ) {
                this.playerScript.keysPressed.set( cc.macro.KEY.down, true );
                this.playerScript.keysPressed.delete( cc.macro.KEY.up );
                this.findFacingDirection( touchPosition.x, touchPosition.y );
            }
        }
    }

    onTouchEnd = ( e ) => {
        e.stopPropagation();

        this.playerScript.rightAnimation.pause();
        this.playerScript.leftAnimation.pause();
        this.playerScript.upAnimation.pause();
        this.playerScript.downAnimation.pause();

        this.playerScript.keysPressed.delete( cc.macro.KEY.right );
        this.playerScript.keysPressed.delete( cc.macro.KEY.left );
        this.playerScript.keysPressed.delete( cc.macro.KEY.up );
        this.playerScript.keysPressed.delete( cc.macro.KEY.down );

        this.initialX = null;
        this.initialY = null;

        this.playerScript.joystickOn = false;
    }

    getPlayerScript = () => {
        this.playerScript = this.node.parent.getComponent( 'GameScript' ).playerInstance.getComponent( 'PlayerScript' );
    }

    start = () => {
        this.getPlayerScript();

        this.node.on( cc.Node.EventType.TOUCH_START, this.onTouchStart );
        this.node.on( cc.Node.EventType.TOUCH_MOVE, this.onTouchMove );
        this.node.on( cc.Node.EventType.TOUCH_END, this.onTouchEnd );
        this.node.on( cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd );
    }
}
