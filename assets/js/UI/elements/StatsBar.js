import * as PIXI from "pixi.js";

class StatsBar {
  constructor(setup) {
    this.setup = setup;
    this.setup.debugLog("new StatsBar");

    this.statsBarBarOffset = 23;

    this.addStatsBar();
  }

  addStatsBar = () => {
    const statsBarBodyTexture = this.setup.loader.resources[
      "statsBarBody"
    ].texture.clone();
    const statsBarBody = new PIXI.Sprite(statsBarBodyTexture);
    statsBarBody.tint = this.color;
    statsBarBody.scale.set(this.setup.BS / 1.5);
    this.statsBarBody = statsBarBody;
    this.setup.uiContainer.addChild(statsBarBody);
    this.statsBarBody = statsBarBody;

    const statsBarBarTexture = this.setup.loader.resources[
      "statsBarBar"
    ].texture.clone();
    const statsBarBar = new PIXI.Sprite(statsBarBarTexture);
    statsBarBar.tint = this.color;
    statsBarBar.scale.set(this.setup.BS / 1.5);
    statsBarBar.originalWidth = statsBarBar.width;
    statsBarBar.anchor.y = 0.5;
    this.statsBarBar = statsBarBar;
    this.setup.uiContainer.addChild(statsBarBar);
    this.statsBarBar = statsBarBar;

    const statsBarLabelTexture = this.setup.loader.resources[
      "statsBarLabel"
    ].texture.clone();
    const statsBarLabel = new PIXI.Sprite(statsBarLabelTexture);
    statsBarLabel.tint = this.color;
    statsBarLabel.scale.set(this.setup.BS / 1.5);
    this.statsBarLabel = statsBarLabel;
    this.setup.uiContainer.addChild(statsBarLabel);
    this.statsBarLabel = statsBarLabel;
  };

  getCurrent = () => {
    this.setup.debugLog("NO CURRENT DEFINED");
  };

  render = delta => {
    this.statsBarLabel.position.x =
      this.setup.offset.x + this.setup.BS * this.positions.label.x;
    this.statsBarLabel.position.y =
      this.setup.offset.y + this.setup.BS * this.positions.label.y;
    this.statsBarBody.position.x =
      this.setup.offset.x + this.setup.BS * this.positions.body.x;
    this.statsBarBody.position.y =
      this.setup.offset.y + this.setup.BS * this.positions.body.y;
    this.statsBarBar.position.x =
      this.setup.offset.x + this.setup.BS * this.positions.bar.x;
    this.statsBarBar.position.y =
      this.setup.offset.y + this.setup.BS * this.positions.bar.y;

    this.current = this.getCurrent();

    this.statsBarBar.relWidth =
      (this.statsBarBar.originalWidth / 100) * (100 - this.statsBarBarOffset);
    this.statsBarBar.width =
      (this.statsBarBar.originalWidth / 100) * 23 +
      (((this.statsBarBar.relWidth / 100) * 100) / this.max) * this.current;
  };
}

export default StatsBar;
