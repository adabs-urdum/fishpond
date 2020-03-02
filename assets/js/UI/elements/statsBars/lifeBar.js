import * as PIXI from "pixi.js";
import StatsBar from "../StatsBar.js";

class LifeBar extends StatsBar {
  constructor(setup) {
    super(setup);
    this.setup = setup;
    this.setup.debugLog("new LifeBar");
    this.color = 0xc21717;
    this.statsBarBody.tint = this.color;
    this.statsBarBar.tint = this.color;
    this.statsBarLabel.tint = this.color;
    this.max = this.setup.fish.stats.maxLife;
    this.getCurrent();
    this.positions = {
      label: {
        x: 20,
        y: this.statsBarLabel.height * 2 + this.setup.BS * 50
      },
      body: {
        x: 45,
        y: this.statsBarLabel.height * 2 + this.setup.BS * (45 + 45)
      },
      bar: {
        x: 70,
        y: this.statsBarLabel.height * 2 + this.setup.BS * (86 + 86)
      }
    };
  }

  getCurrent = () => {
    return (this.current = this.setup.fish.stats.life);
  };
}

export default LifeBar;
