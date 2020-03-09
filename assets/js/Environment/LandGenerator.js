import * as PIXI from "pixi.js";

class LandGenerator {
  constructor(setup) {
    this.setup = setup;
    this.setup.debugLog("new LandGenerator");
    this.zIndex = 0;
    this.islands = [];
    this.landmasses = [];

    this.landContainer = new PIXI.Container();
    this.setup.landContainer = this.landContainer;

    this.addIsland();
    this.addPillarLeft();
    this.addPillarRight();

    this.setup.environment.addChildAt(this.landContainer, 6);
  }

  addPillarLeft = () => {
    const texture = this.setup.loader.resources["pillar"].texture.clone();
    const pillarLeft = new PIXI.Sprite(texture);
    pillarLeft.scale.set(this.setup.vh * 0.074);
    pillarLeft.anchor.x = 0.8;
    pillarLeft.anchor.y = 0.1;
    pillarLeft.position.x = this.setup.stageWidthHalf * -1;
    pillarLeft.position.y = this.setup.renderer.screen.height * 1.5;
    this.landContainer.addChildAt(pillarLeft, this.zIndex);
    this.zIndex += 1;
    this.landmasses.push(pillarLeft);
    this.islands.push(pillarLeft);
  };

  addPillarRight = () => {
    const texture = this.setup.loader.resources["pillar"].texture.clone();
    const pillarRight = new PIXI.Sprite(texture);
    pillarRight.scale.set(this.setup.vh * 0.074);
    pillarRight.scale.x *= -1;
    pillarRight.anchor.x = 0.2;
    pillarRight.anchor.y = 0.1;
    pillarRight.position.x = this.setup.stageWidthHalf + pillarRight.width * 2;
    this.landContainer.addChildAt(pillarRight, this.zIndex);
    this.zIndex += 1;
    this.landmasses.push(pillarRight);
    this.islands.push(pillarRight);
  };

  addIsland = () => {
    const texture = this.setup.loader.resources["island"].texture.clone();
    const island = new PIXI.Sprite(texture);
    island.anchor.x = 0.5;
    island.anchor.y = 0.1;
    island.position.x =
      Math.random() * this.setup.stageWidthHalf * 2 - this.setup.stageWidthHalf;
    this.islands.push(island);
    this.landContainer.addChildAt(island, this.zIndex);
    this.zIndex += 1;
    this.landmasses.push(island);
  };

  render = delta => {};
}

export default LandGenerator;
