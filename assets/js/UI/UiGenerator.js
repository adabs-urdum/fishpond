import * as PIXI from "pixi.js";
import LifeBar from "./elements/statsBars/lifeBar.js";
import XpBar from "./elements/statsBars/xpBar";

class UiGenerator {
  constructor(setup) {
    this.setup = setup;
    this.setup.debugLog("new UiGenerator");
    this.pixiObj = new PIXI.Container();

    this.xpBar = new XpBar(setup);
    this.pixiObj.addChild(this.xpBar.pixiObj);
    this.lifeBar = new LifeBar(setup);
    this.pixiObj.addChild(this.lifeBar.pixiObj);
  }

  render = delta => {
    this.pixiObj.position.x = this.setup.offset.x;
    this.pixiObj.position.y = this.setup.offset.y;
    this.xpBar.render(delta);
    this.lifeBar.render(delta);
  };
}

export default UiGenerator;
