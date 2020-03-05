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
    }, 2737);

    this.schools = [];

    const school = new FishSchool(this.setup);

    this.schools.push(school);

    this.schools.forEach(school => {
      // setInterval(() => {
      //   const newPosition = {
      //     x: school.position.x + 10,
      //     y: school.position.y - 10
      //   };
      //   const newAngle = this.setup.getAngleBetweenPoints(
      //     school.position,
      //     newPosition
      //   );
      //   school.children.forEach((child, childKey) => {
      //     child.angle = newAngle;
      //   });
      //   this.setup.ticker.addOnce(moveTowardsAngle);
      //   const that = this;
      //   function moveTowardsAngle(delta) {
      //     school.x += speed * Math.cos((newAngle * Math.PI) / 180) * delta;
      //     school.y += speed * Math.sin((newAngle * Math.PI) / 180) * delta;
      //     if (school.position.x >= newPosition.x) {
      //       console.log("now");
      //       that.setup.ticker.remove(moveTowardsAngle);
      //     }
      //   }
      // }, 1000);
    });

    this.setup.foodContainer.addChild(school.pixiObj);
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
