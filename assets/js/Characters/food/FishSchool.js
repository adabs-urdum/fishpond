import * as PIXI from "pixi.js";
import Fish from "./Fish";

class FishSchool {
  constructor(setup, fishAmount, bodyTextureName, jawTextureName) {
    this.setup = setup;
    this.setup.debugLog("new FishSchool");
    this.pixiObj = new PIXI.Container();
    this.fishes = [];
    this.deadFishes = [];
    this.initFishAmount = fishAmount ? fishAmount : 1;

    this.setPosition();
    this.moveInterval = setTimeout(this.setNewPos, 3000 + Math.random() * 1000);

    for (let i = 0; i < this.initFishAmount; i++) {
      const sizeFactor = 0.15;
      const fish = new Fish(
        this.setup,
        sizeFactor,
        bodyTextureName,
        jawTextureName
      );
      fish.setInitialPosition();
      this.fishes.push(fish);
      this.pixiObj.addChild(fish.pixiObj);
    }
  }

  setNewPos = () => {
    this.newPos = this.setup.getNewRandomPos({
      x: this.setup.renderer.screen.width * 2,
      y: this.setup.renderer.screen.height / 3
    });
    this.newPos.y *= -1;

    this.fishes.forEach(fish => {
      if (fish.stats.health > 0) {
        const angle =
          (this.setup.getRotationBetweenPoints(this.pixiObj, this.newPos) *
            180) /
          Math.PI;

        fish.animateRotation(angle, 30);
      }
    });
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

    this.setup.moveToPosition(this.pixiObj, distance, rotation, 1);

    this.fishes.forEach((fish, fishKey) => {
      if (fish.stats.health > 0) {
        fish.setSpriteDirection((rotation * 180) / Math.PI);
        fish.pelvic.animationSpeed = 1;
        fish.caudal.animationSpeed = 1;
      } else {
        fish.pelvic.animationSpeed = 0;
        fish.caudal.animationSpeed = 0;

        this.setup.moveToPosition(fish.pixiObj, 0, 0, 1);

        this.pixiObj.removeChild(fish.pixiObj);
        this.fishes.splice(fishKey, 1);
        this.deadFishes.push(fish);

        this.setup.foodContainer.addChild(fish.pixiObj);
        fish.pixiObj.position.x =
          fish.pixiObj.position.x + this.pixiObj.position.x;
        fish.pixiObj.position.y =
          fish.pixiObj.position.y + this.pixiObj.position.y;
      }
    });

    if (distance < 10) {
      this.fishes.forEach(fish => {
        if (fish.stats.health > 0) {
          fish.pelvic.animationSpeed = 0.2;
          fish.caudal.animationSpeed = 0.2;
          fish.fromAngle = fish.pixiObj.angle;
        }
      });
      this.setup.ticker.remove(this.moveTo, this);
      clearInterval(this.moveInterval);
      this.moveInterval = setTimeout(this.setNewPos, 3000);
    }
  };

  setPosition = () => {
    this.pixiObj.position.x =
      Math.random() * this.setup.stageWidthHalf * 2 - this.setup.stageWidthHalf;
    this.pixiObj.position.y =
      Math.random() * this.setup.waterSurface.position.y +
      this.setup.waterSurface.height / 2;

    // if (this.setup.debug) {
    //   this.pixiObj.position.x =
    //     this.setup.offset.x +
    //     window.innerWidth * Math.random() -
    //     window.innerWidth / 2;
    // }
  };

  render = delta => {
    this.fishes.forEach((fish, fishKey) => {
      if (fish.pixiObj && fish.pixiObj.angle != "undefined") {
        const alive = fish.render(delta);
        if (!alive) {
          this.fishes.splice(fishKey, 1);
        }
      }
    });
    this.deadFishes.forEach((fish, fishKey) => {
      if (fish.pixiObj && fish.pixiObj.angle != "undefined") {
        const alive = fish.render(delta);
        if (!alive) {
          this.deadFishes.splice(fishKey, 1);
        }
      }
    });
  };
}

export default FishSchool;
