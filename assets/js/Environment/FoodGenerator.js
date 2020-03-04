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

    this.schools = [];

    const school = new PIXI.Container();
    school.position.x =
      this.setup.offset.x +
      window.innerWidth * Math.random() -
      window.innerWidth;
    school.position.y = this.setup.offset.y - window.innerHeight / 2;

    if (setup.debug) {
      school.position.y = 0 - window.innerHeight / 3;
      school.position.x = 0;
    }

    this.schools.push(school);

    this.schools.forEach(school => {
      this.fishes = [];
      let fish = new Fish(this.setup);
      this.fishes.push(fish);
      school.addChild(fish.pixiObj);
    });

    this.setup.foodContainer.addChild(school);
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
