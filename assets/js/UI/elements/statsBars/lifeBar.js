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
    this.max = this.setup.fish.stats.maxHealth;
    this.getCurrent();
    this.positions = {
      label: {
        x: this.setup.vh * 1,
        y: this.setup.vh * 15
      },
      body: {
        x: this.setup.vh * 2,
        y: this.setup.vh * 17.5
      },
      bar: {
        x: this.setup.vh * 4.4,
        y: this.setup.vh * 21.5
      }
    };
  }

  getCurrent = () => {
    if (this.setup.fish.stats.health <= 0) {
      this.setup.fish.stats.health = 0;
    }
    return (this.current = this.setup.fish.stats.health);
  };
}

export default LifeBar;
