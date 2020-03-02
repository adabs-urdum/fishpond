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
        x: 20,
        y: 20
      },
      body: {
        x: 45,
        y: 45
      },
      bar: {
        x: 70,
        y: 88
      }
    };
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

    const relCurrentXp = this.setup.fish.stats.xp - pastLevelsXp;

    return (this.current = relCurrentXp);
  };
}

export default xpBar;
