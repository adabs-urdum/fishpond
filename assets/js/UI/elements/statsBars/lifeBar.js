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
        y: this.setup.vmin * 20
      },
      body: {
        x: 45,
        y: this.setup.vmin * 22.6
      },
      bar: {
        x: 70,
        y: this.setup.vmin * 27.4
      }
    };
  }

  getCurrent = () => {
    return (this.current = this.setup.fish.stats.life);
  };
}

export default LifeBar;
