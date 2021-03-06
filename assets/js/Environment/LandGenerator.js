import * as PIXI from "pixi.js";

class LandGenerator {
  constructor(setup) {
    this.setup = setup;
    this.setup.debugLog("new LandGenerator");
    this.zIndex = 0;
    this.islands = [];
    this.landmasses = [];
    this.tint = 0xe8fbff;

    this.landContainer = new PIXI.Container();
    this.setup.landContainer = this.landContainer;

    this.addIsland();
    this.addPillarLeft();
    this.addPillarRight();
    for (let i = 0; i < 5; i++) {
      this.addBoulder();
    }

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
    pillarLeft.tint = this.tint;
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
    pillarRight.tint = this.tint;
    pillarRight.position.x = this.setup.stageWidthHalf + pillarRight.width * 2;
    this.landContainer.addChildAt(pillarRight, this.zIndex);
    this.zIndex += 1;
    this.landmasses.push(pillarRight);
    this.islands.push(pillarRight);
  };

  addBoulder = () => {
    const boulderTextureNames = ["boulder", "boulder2", "boulder3"];
    const texture = this.setup.loader.resources[
      boulderTextureNames.getRandomValue(boulderTextureNames)
    ].texture.clone();
    const boulder = new PIXI.Sprite(texture);
    boulder.anchor.x = 0;
    boulder.anchor.y = 0;
    boulder.tint = this.tint;
    boulder.position.x = this.getRandomPositionX();
    boulder.position.y = this.getRandomPositionY();

    let freeSpace = false;
    while (!freeSpace) {
      this.landmasses.forEach(landmass => {
        const collision = this.setup.getCollision(landmass, boulder);
        if (collision) {
          boulder.position.x = this.getRandomPositionX();
          boulder.position.y = this.getRandomPositionY();
        } else {
          freeSpace = true;
        }
      });
    }

    boulder.scale.set(
      Math.random() * 0.5 * this.setup.BS + 0.4 * this.setup.BS
    );

    this.landContainer.addChildAt(boulder, this.zIndex);
    this.zIndex += 1;
    this.landmasses.push(boulder);
  };

  getRandomPositionX = () => {
    return (
      this.setup.BS * 10 +
      Math.random() * this.setup.stageWidthHalf * 2 -
      this.setup.stageWidthHalf -
      this.setup.BS * 20
    );
  };

  getRandomPositionY = () => {
    return (
      Math.random() *
      (this.setup.offset.y + this.setup.vh * 33 - this.setup.sea.height)
    );
  };

  addIsland = () => {
    const texture = this.setup.loader.resources["island"].texture.clone();
    const island = new PIXI.Sprite(texture);
    island.anchor.x = 0.5;
    island.anchor.y = 0.1;
    island.tint = this.tint;
    island.position.x = this.getRandomPositionX();

    this.islands.push(island);
    this.landContainer.addChildAt(island, this.zIndex);
    this.zIndex += 1;
    this.landmasses.push(island);
  };

  render = delta => {};
}

export default LandGenerator;
