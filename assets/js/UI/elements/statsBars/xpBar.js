import * as PIXI from "pixi.js";
import StatsBar from "../StatsBar.js";

class xpBar extends StatsBar {
  constructor(setup) {
    super(setup);
    this.setup = setup;
    this.setup.debugLog("new xpBar");
    this.color = 0xe3b829;
    this.statsBarBody.tint = this.color;
    this.statsBarBar.tint = this.color;
    this.statsBarLabel.tint = this.color;
    this.getCurrent();
    this.positions = {
      label: {
        x: this.setup.vh * 1,
        y: this.setup.vh * 1
      },
      body: {
        x: this.setup.vh * 10,
        y: this.setup.vh * 3.5
      },
      bar: {
        x: this.setup.vh * 11,
        y: this.setup.vh * 7.5
      }
    };
    this.pixiObj.position.x = this.setup.vh * 2.5;
    this.pixiObj.position.y = this.setup.vh * 2.5;
  }

  getCurrent = () => {
    const currentLevel = this.setup.fish.stats.levels[
      this.setup.fish.stats.level
    ];
    this.max = currentLevel.relXp;

    let pastLevelsXp = 0;
    const pastLevels = Object.keys(this.setup.fish.stats.levels)
      .slice(0, this.setup.fish.stats.level - 1)
      .forEach(levelKey => {
        const currentLevel = this.setup.fish.stats.levels[levelKey];
        pastLevelsXp += currentLevel.relXp;
      });

    let relCurrentXp = this.setup.fish.stats.xp - pastLevelsXp;
    if (relCurrentXp > this.max) {
      relCurrentXp = this.max;
    }
    return (this.current = relCurrentXp);
  };
}

export default xpBar;
