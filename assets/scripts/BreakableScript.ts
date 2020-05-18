const {ccclass, property} = cc._decorator;

@ccclass
export default class BreakableClass extends cc.Component {

    @property( cc.Prefab )
    speedUp : cc.Prefab = null;

    @property( cc.Prefab )
    rangeUp : cc.Prefab = null;

    @property( cc.Prefab )
    maxBombUp : cc.Prefab = null;

    removeBreakable = () => {
        let newItem = null;

        if( this.speedUp && Math.random() < 0.25 ) {
            newItem = cc.instantiate( this.speedUp );
        }
        else if( this.rangeUp && Math.random() < 0.25 ) {
            newItem = cc.instantiate( this.rangeUp );
        }
        else if( this.maxBombUp && Math.random() < 0.25 ) {
            newItem = cc.instantiate( this.maxBombUp );
        }

        if( newItem ) {
            this.node.parent.addChild( newItem, 3 );
            newItem.setPosition( cc.v2( this.node.x, this.node.y ) );
        }

        this.node.destroy();
    }

}
