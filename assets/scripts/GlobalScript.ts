const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    // onLoad () {}

    start = () => {
        // Enable Collisions
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDrawBoundingBox = true;
    }

    // update (dt) {}
}
