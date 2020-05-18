const {ccclass, property} = cc._decorator;
import GameClass from './GameScript';

@ccclass
export default class PlayerClass extends cc.Component {

    @property( cc.Prefab )
    explosive : cc.Prefab = null;

    @property
    speed : number = 150;

    @property
    maxBombs : number = 1;

    @property
    explosionRadius : number = 2;

    numBombsPlaced : number = 0;

    keysPressed : Map<number, boolean> = new Map();

    rightAnimation : cc.AnimationState;
    leftAnimation : cc.AnimationState;
    upAnimation : cc.AnimationState;
    downAnimation : cc.AnimationState;

    boundingBox : cc.Node;

    lastDistMoved : number = 0;
    canMoveRight : boolean = true;
    canMoveLeft : boolean = true;
    canMoveUp : boolean = true;
    canMoveDown : boolean = true;

    joystickOn : boolean = false;

    gameScript : GameClass;

    checkAvailableMovements = ( other : cc.Collider, self : cc.Collider, otherIsExplosive : boolean ) => {
        let dist = this.node.position.sub( other.node.position );
        let selfBoxCollider = self.node.getComponent( cc.BoxCollider ).size;
        let otherBoxCollider = other.node.getComponent( cc.BoxCollider ).size;

        let rightOffset = dist.x + selfBoxCollider.width / 2 + otherBoxCollider.width / 2;
        let leftOffset = dist.x - ( selfBoxCollider.width / 2 + otherBoxCollider.width / 2 );
        let topOffset = dist.y + selfBoxCollider.height / 2 + otherBoxCollider.height / 2;
        let bottomOffset = dist.y - ( selfBoxCollider.height / 2 + otherBoxCollider.height / 2 );
        let horizColMargin = this.lastDistMoved + ( this.node.width - selfBoxCollider.width ) / 2 + ( other.node.width - otherBoxCollider.width ) / 2;
        let vertColMargin = this.lastDistMoved + ( this.node.height - selfBoxCollider.height ) / 2 + ( other.node.height - otherBoxCollider.height ) / 2;

        if( otherIsExplosive && Math.abs( dist.x ) < otherBoxCollider.width / 2 - horizColMargin
                && Math.abs( dist.y ) < otherBoxCollider.height / 2 - vertColMargin ) {
            return
        }

        // Block detected right side of player, prevent moving up
        if( dist.x < 0 && horizColMargin >= rightOffset && ! ( topOffset === 0 ) && ! ( bottomOffset === 0 ) 
                && ! ( Math.abs( bottomOffset ) === Math.abs( rightOffset ) ) && ! ( Math.abs( topOffset ) === Math.abs( rightOffset ) ) ) {
            this.node.x -= rightOffset;
            this.canMoveRight = false;
        }
        else {
            this.canMoveRight = true;
        }

        // Block detected left side of player, prevent moving left
        if( dist.x > 0 && - horizColMargin <= leftOffset && ! ( topOffset === 0 ) && ! ( bottomOffset === 0 ) 
        && ! ( Math.abs( bottomOffset ) === Math.abs( leftOffset ) ) && ! ( Math.abs( topOffset ) === Math.abs( leftOffset ) ) ) {
            this.node.x -= leftOffset; // subtracts negative number
            this.canMoveLeft = false;
        }
        else {
            this.canMoveLeft = true;
        }

        // Block detected on top of player, prevent moving up
        if( dist.y < 0 && vertColMargin >= topOffset && ! ( leftOffset === 0 ) && ! ( rightOffset === 0 ) ) {
            this.node.y-= topOffset;
            this.canMoveUp = false;
        }
        else {
            this.canMoveUp = true;
        }

        // Block detected below the player, prevent moving down
        if( dist.y > 0 && - vertColMargin <= bottomOffset && ! ( leftOffset === 0 ) && ! ( rightOffset === 0 ) ) {
            this.node.y -= bottomOffset; // subtracts negative number
            this.canMoveDown = false;
        }
        else {
            this.canMoveDown = true;
        }
    }

    attemptBombPlacement = () => {
        let xPos = Math.round( this.node.x / 48 ) * 48;
        let yPos = Math.round( this.node.y / 48 ) * 48;
        
        if( ! this.gameScript.bombsPlaced.get( xPos + ', ' + yPos ) && this.numBombsPlaced < this.maxBombs ) {
            this.numBombsPlaced ++;
            this.gameScript.bombsPlaced.set( xPos + ', ' + yPos, true );

            let newExplosive = cc.instantiate( this.explosive );
            let explosiveScript = newExplosive.getComponent( 'ExplosiveScript' );

            explosiveScript.player = this;
            explosiveScript.explosionRadius = this.explosionRadius;

            this.node.parent.addChild( newExplosive, 4 );
            newExplosive.setPosition( cc.v2( xPos, yPos ) );
        }
    }

    onCollisionEnter = ( other : cc.Collider, self : cc.Collider ) => {
        if( other.node.group === 'obstacle' || other.node.group === 'breakable' || other.node.group === 'explosive' ) {
            this.checkAvailableMovements( other, self, other.node.group === 'explosive' );
        }
        else if( other.node.group === 'danger' ) {
            this.cleanUp();
        }
    }

    onCollisionStay = ( other : cc.Collider, self : cc.Collider ) => {
        if( other.node.group === 'obstacle' || other.node.group === 'breakable' || other.node.group === 'explosive' ) {
            this.checkAvailableMovements( other, self, other.node.group === 'explosive' );
        }
    }

    onCollisionExit = ( other : cc.Collider, self : cc.Collider ) => {
        // let dist = this.node.position.sub( other.node );
        
        // dist.x += dist.x < 0 ? self.node.width / 2 + other.node.width / 2 : - ( self.node.width / 2 + other.node.width / 2 );
        // dist.y += dist.y < 0 ? self.node.height / 2 + other.node.height / 2 : - ( self.node.height / 2 + other.node.height / 2 );

        this.canMoveRight = true;
        this.canMoveLeft = true;
        this.canMoveUp = true;
        this.canMoveDown = true;
    }

    onKeyDown = ( e : cc.Event.EventKeyboard ) => {
        this.keysPressed.set( e.keyCode, true );

        if( e.keyCode == cc.macro.KEY.space ) {
            this.attemptBombPlacement();
        }
    }

    onKeyUp = ( e : cc.Event.EventKeyboard ) => {
        this.keysPressed.delete( e.keyCode );

        if( e.keyCode == cc.macro.KEY.right ) {
            this.rightAnimation.pause();
        }
        else if( e.keyCode == cc.macro.KEY.left ) {
            this.leftAnimation.pause();
        }
        else if( e.keyCode == cc.macro.KEY.up ) {
            this.upAnimation.pause();
        }
        else if( e.keyCode == cc.macro.KEY.down ) {
            this.downAnimation.pause();
        }
    }

    onLoad = () => {
        cc.systemEvent.on( cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown )
        cc.systemEvent.on( cc.SystemEvent.EventType.KEY_UP, this.onKeyUp )

        this.leftAnimation = this.getComponent( cc.Animation ).getAnimationState( 'block-left' );
        this.rightAnimation = this.getComponent( cc.Animation ).getAnimationState( 'block-right' );
        this.upAnimation = this.getComponent( cc.Animation ).getAnimationState( 'block-backwards' );
        this.downAnimation = this.getComponent( cc.Animation ).getAnimationState( 'block-forward' );

        this.boundingBox = this.node.parent;

        this.gameScript = this.node.parent.parent.getComponent( 'GameScript' );
    }

    cleanUp = () => {
        cc.systemEvent.off( cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown );
        cc.systemEvent.off( cc.SystemEvent.EventType.KEY_UP, this.onKeyUp );
        this.rightAnimation.pause();
        this.leftAnimation.pause();
        this.upAnimation.pause();
        this.downAnimation.pause();
        this.node.destroy();
    }

    update = ( dt : number ) => {
        this.lastDistMoved = this.speed * dt;

        if( this.keysPressed.get( cc.macro.KEY.right ) && this.canMoveRight ) {
            if( ! this.joystickOn ) this.rightAnimation.play();
            if( this.node.position.x < this.node.parent.width / 2 - this.node.width / 2 ) {
                this.node.x += this.speed * dt;
            }
            else {
                this.node.x = this.node.parent.width / 2 - this.node.width / 2;
            }
        }
        if( this.keysPressed.get( cc.macro.KEY.left ) && this.canMoveLeft ) {
            if( ! this.joystickOn ) this.leftAnimation.play();
            if( this.node.position.x > - this.node.parent.width / 2 + this.node.width / 2 ) {
                this.node.x -= this.speed * dt;
            }
            else {
                this.node.x = - this.node.parent.width / 2 + this.node.width / 2;
            }
        }
        if( this.keysPressed.get( cc.macro.KEY.up ) && this.canMoveUp ) {
            if( ! this.joystickOn ) this.upAnimation.play();
            if( this.node.position.y < this.node.parent.height / 2 - this.node.height / 2 ) {
                this.node.y += this.speed * dt;
            }
            else {
                this.node.y = this.node.parent.height / 2 - this.node.height / 2;
            }
        }
        if( this.keysPressed.get( cc.macro.KEY.down ) && this.canMoveDown ) {
            if( ! this.joystickOn ) this.downAnimation.play();
            if( this.node.position.y > - this.node.parent.height / 2 + this.node.height / 2 ) {
                this.node.y -= this.speed * dt;
            }
            else {
                this.node.y = - this.node.parent.height / 2 + this.node.height / 2;
            }
        }
    }
}
