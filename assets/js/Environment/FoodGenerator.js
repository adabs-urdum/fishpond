import * as PIXI from "pixi.js";
import BloodWorm from "./../Characters/food/Bloodworm.js";
import Fish from "./../Characters/food/Fish.js";

class FoodGenerator {
  constructor(setup) {
    this.setup = setup;
    this.setup.debugLog("new FoodGenerator");

    this.bloodworms = [];
    this.bloodworms.push(new BloodWorm(this.setup));
    setInterval(() => {
      this.bloodworms.push(new BloodWorm(this.setup));
    }, 2737);

    this.fishes = [];
    this.fishes.push(new Fish(this.setup));
  }

  render = delta => {
    this.bloodworms.map((bloodworm, bloodwormKey) => {
      const alive = bloodworm.render(delta);

      if (!alive) {
        this.bloodworms.splice(bloodwormKey, 1);
      }
    });
  };
}

export default FoodGenerator;
