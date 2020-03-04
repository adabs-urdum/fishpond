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

    school.fishes = [];

    this.schools.push(school);

    this.schools.forEach(school => {
      let speed = 0;

      this.fishes = [];
      let fish = new Fish(this.setup);
      this.fishes.push(fish);
      school.fishes.push(fish);
      school.addChild(fish.pixiObj);
      speed = fish.stats.speed;

      setInterval(() => {
        const newPosition = {
          x: school.position.x + 10,
          y: school.position.y - 10
        };
        const newAngle = this.setup.getAngleBetweenPoints(
          school.position,
          newPosition
        );
        school.children.forEach((child, childKey) => {
          child.angle = newAngle;
        });
        this.setup.ticker.addOnce(moveTowardsAngle);
        const that = this;
        function moveTowardsAngle(delta) {
          school.x += speed * Math.cos((newAngle * Math.PI) / 180) * delta;
          school.y += speed * Math.sin((newAngle * Math.PI) / 180) * delta;
          if (school.position.x >= newPosition.x) {
            console.log("now");
            that.setup.ticker.remove(moveTowardsAngle);
          }
        }
      }, 1000);
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

    this.fishes.forEach((fish, fishKey) => {
      const alive = fish.render(delta);

      if (!alive) {
        this.fishes.splice(fishKey, 1);
      }
    });
  };
}

export default FoodGenerator;
