import * as PIXI from "pixi.js";
import BloodWorm from "./../Characters/food/Bloodworm.js";
import Fish from "./../Characters/food/Fish.js";
import FishSchool from "./../Characters/food/FishSchool.js";

class FoodGenerator {
  constructor(setup) {
    this.setup = setup;
    this.setup.debugLog("new FoodGenerator");

    this.bloodworms = [];
    this.bloodworms.push(new BloodWorm(this.setup));
    setInterval(() => {
      this.bloodworms.push(new BloodWorm(this.setup));
    }, 9000);

    this.schools = [];

    let school = new FishSchool(
      this.setup,
      6,
      "fishTargetBody",
      "fishTargetJaw"
    );
    this.schools.push(school);

    school = new FishSchool(this.setup, 9, "fishTargetBody2", "fishTargetJaw2");
    this.schools.push(school);

    this.schools.forEach(school => {
      this.setup.foodContainer.addChild(school.pixiObj);
    });
  }

  render = delta => {
    this.bloodworms.map((bloodworm, bloodwormKey) => {
      const alive = bloodworm.render(delta);

      if (!alive) {
        this.bloodworms.splice(bloodwormKey, 1);
      }
    });

    this.schools.forEach(school => {
      school.render(delta);
    });
  };
}

export default FoodGenerator;
