import * as PIXI from "pixi.js";
import Fish from "./Fish";

class FishSchool {
  constructor(setup) {
    this.setup = setup;
    this.setup.debugLog("new FishSchool");
    this.pixiObj = new PIXI.Container();
    this.fishes = [];
    this.initFishAmount = 20;

    this.setPosition();
    this.moveInterval = setTimeout(this.setNewPos, 3000);

    for (let i = 0; i < this.initFishAmount; i++) {
      const fish = new Fish(this.setup);
      fish.setInitialPosition();
      this.fishes.push(fish);
      this.pixiObj.addChild(fish.pixiObj);
    }
  }

  setNewPos = () => {
    this.newPos = this.setup.getNewRandomPos();
    this.newPos.y *= -1;

    this.setup.ticker.add(this.moveTo, this);
  };

  moveTo = () => {
    const distance = this.setup.getDistanceBetweenPoints(
      this.pixiObj,
      this.newPos
    );
    const rotation = this.setup.getRotationBetweenPoints(
      this.pixiObj,
      this.newPos
    );

    this.fishes.forEach(fish => {
      fish.pixiObj.rotation = rotation;

      fish.setSpriteDirection((rotation * 180) / Math.PI);
      fish.pelvic.animationSpeed = 1;
      fish.caudal.animationSpeed = 1;
    });

    this.setup.moveToPosition(this.pixiObj, distance, rotation, 1);

    if (distance < 10) {
      this.fishes.forEach(fish => {
        fish.pelvic.animationSpeed = 0.2;
        fish.caudal.animationSpeed = 0.2;
        fish.pixiObj.angle = 0;
        fish.pixiObj.scale.y = Math.abs(fish.pixiObj.scale.y);
      });
      this.setup.ticker.remove(this.moveTo, this);
      clearInterval(this.moveInterval);
      this.moveInterval = setTimeout(this.setNewPos, 3000);
    }
  };

  setPosition = () => {
    this.pixiObj.position.x =
      this.setup.offset.x +
      window.innerWidth * Math.random() -
      window.innerWidth;
    this.pixiObj.position.y =
      Math.random() * this.setup.waterSurface.position.y;

    if (this.setup.debug) {
      this.pixiObj.position.x = 0;
    }
  };

  render = delta => {
    this.fishes.forEach((fish, fishKey) => {
      const alive = fish.render(delta);

      if (!alive) {
        this.fishes.splice(fishKey, 1);
      }
    });
    // this.pixiObj.x += 1 * delta;
  };
}

export default FishSchool;
