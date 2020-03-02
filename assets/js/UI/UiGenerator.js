import * as PIXI from "pixi.js";
import LifeBar from "./elements/statsBars/lifeBar.js";
import XpBar from "./elements/statsBars/xpBar";

class UiGenerator {
  constructor(setup) {
    this.setup = setup;
    this.setup.debugLog("new UiGenerator");

    this.xpBar = new XpBar(setup);
    this.lifeBar = new LifeBar(setup);
  }

  render = delta => {
    this.xpBar.render(delta);
    this.lifeBar.render(delta);
  };
}

export default UiGenerator;
