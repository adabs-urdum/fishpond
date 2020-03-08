import * as PIXI from "pixi.js";
import BloodWorm from "./../Characters/food/Bloodworm.js";
import Fish from "./../Characters/food/Fish.js";
import FishSchool from "./../Characters/food/FishSchool.js";
import Shark from "../Characters/Shark.js";

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

    for (let i = 0; i < 3; i++) {
      const factor = Math.round(Math.random());
      const body = factor ? "fishTargetBody" : "fishTargetBody2";
      const jaw = factor ? "fishTargetJaw" : "fishTargetJaw2";

      this.addSchool(body, jaw);
    }

    this.sharks = [];
    for (let i = 0; i < 2; i++) {
      const shark = new Shark(this.setup);
      this.sharks.push(shark);
    }
  }

  addSchool = (body, jaw) => {
    const school = new FishSchool(
      this.setup,
      Math.round(Math.random() * 10),
      body,
      jaw
    );
    this.schools.push(school);
    this.setup.foodContainer.addChild(school.pixiObj);
  };

  render = delta => {
    this.bloodworms.map((bloodworm, bloodwormKey) => {
      const alive = bloodworm.render(delta);

      if (!alive) {
        this.bloodworms.splice(bloodwormKey, 1);
      }
    });

    if (this.schools.length < 4) {
      const factor = Math.round(Math.random());
      const body = factor ? "fishTargetBody" : "fishTargetBody2";
      const jaw = factor ? "fishTargetJaw" : "fishTargetJaw2";

      this.addSchool(body, jaw);
    }

    this.schools.forEach((school, schoolKey) => {
      const fishes = school.fishes.concat(school.deadFishes);

      if (fishes.length) {
        school.render(delta);
      } else {
        this.schools.splice(schoolKey, 1);
      }
    });

    this.sharks.forEach((shark, sharkKey) => {
      const alive = shark.render(delta);
      if (!alive) {
        this.sharks.splice(sharkKey, 1);
      }
    });

    if (this.sharks.length < 1) {
      const shark = new Shark(this.setup);
      this.sharks.push(shark);
    }
  };
}

export default FoodGenerator;
