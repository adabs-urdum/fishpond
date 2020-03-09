import * as PIXI from "pixi.js";

class StatsBar {
  constructor(setup) {
    this.setup = setup;
    this.setup.debugLog("new StatsBar");
    this.pixiObj = new PIXI.Container();
    this.offset = {
      x: 0,
      y: 0
    };

    this.statsBarBarOffset = 23;

    this.addStatsBar();
  }

  addStatsBar = () => {
    const scaleFactor = this.setup.vh / 30;

    const statsBarBodyTexture = this.setup.loader.resources[
      "statsBarBody"
    ].texture.clone();
    const statsBarBody = new PIXI.Sprite(statsBarBodyTexture);
    statsBarBody.tint = this.color;
    statsBarBody.scale.set(scaleFactor);
    this.statsBarBody = statsBarBody;
    this.pixiObj.addChild(statsBarBody);
    this.statsBarBody = statsBarBody;

    const statsBarBarTexture = this.setup.loader.resources[
      "statsBarBar"
    ].texture.clone();
    const statsBarBar = new PIXI.Sprite(statsBarBarTexture);
    statsBarBar.tint = this.color;
    statsBarBar.scale.set(scaleFactor);
    statsBarBar.originalWidth = statsBarBar.width;
    statsBarBar.anchor.y = 0.5;
    this.statsBarBar = statsBarBar;
    this.pixiObj.addChild(statsBarBar);
    this.statsBarBar = statsBarBar;

    const statsBarLabelTexture = this.setup.loader.resources[
      "statsBarLabel"
    ].texture.clone();
    const statsBarLabel = new PIXI.Sprite(statsBarLabelTexture);
    statsBarLabel.tint = this.color;
    statsBarLabel.scale.set(scaleFactor);
    this.statsBarLabel = statsBarLabel;
    this.pixiObj.addChild(statsBarLabel);
    this.statsBarLabel = statsBarLabel;
  };

  getCurrent = () => {
    this.setup.debugLog("NO CURRENT DEFINED");
  };

  render = delta => {
    this.statsBarLabel.position.x = 0;
    this.statsBarLabel.position.y = 0;

    this.statsBarBody.position.x =
      this.statsBarLabel.position.x + this.setup.vh * 1.3;
    this.statsBarBody.position.y = this.setup.vh * 1.4;

    this.statsBarBar.position.x =
      this.statsBarBody.position.x + this.setup.vh * 1.2;
    this.statsBarBar.position.y =
      this.statsBarBody.position.y + this.setup.vh * 2.17;

    this.current = this.getCurrent();

    this.statsBarBar.relWidth =
      (this.statsBarBar.originalWidth / 100) * (100 - this.statsBarBarOffset);
    this.statsBarBar.width =
      (this.statsBarBar.originalWidth / 100) * 23 +
      (((this.statsBarBar.relWidth / 100) * 100) / this.max) * this.current;
  };
}

export default StatsBar;
