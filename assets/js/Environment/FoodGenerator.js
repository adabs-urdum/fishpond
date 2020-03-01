import * as PIXI from "pixi.js";

class FoodGenerator {
  constructor(setup) {
    this.setup = setup;
    this.setup.debugLog("new FoodGenerator");

    this.bloodworms = [];
    setInterval(() => {
      console.log("new BloodWorm");

      this.bloodworms.push(this.addBloodWorm());
    }, 2737);
  }

  addBloodWorm = () => {
    const bloodwormFrames = [];
    const bloodwormTexture = this.setup.loader.resources["bloodworm"].texture;
    for (let i = 0; i < 4; i++) {
      bloodwormFrames.push(new PIXI.Rectangle(659 * i, 0, 659, 440));
    }
    bloodwormTexture.frame = bloodwormFrames[0];

    const bloodwormTextures = [];
    for (let i = 0; i < bloodwormFrames.length; i++) {
      const bloodwormAnimationTexture = bloodwormTexture.clone();
      bloodwormAnimationTexture.frame = bloodwormFrames[i];
      bloodwormTextures.push(bloodwormAnimationTexture);
    }

    const bloodworm = new PIXI.AnimatedSprite(bloodwormTextures);
    const range = 3;
    bloodworm.randomSpawnPointY = this.setup.renderer.screen.height * -1;
    bloodworm.position.y = bloodworm.randomSpawnPointY;
    bloodworm.randomSpawnPointX =
      this.setup.renderer.screen.width * Math.random() -
      this.setup.renderer.screen.width / 2;
    bloodworm.position.x = bloodworm.randomSpawnPointX;
    bloodworm.animationSpeed = 1;
    bloodworm.scale.set(0.08);
    bloodworm.loop = true;
    bloodworm.animationSpeed = 0.2;
    bloodworm.anchor.x = 0.5;
    bloodworm.anchor.y = 0.5;
    bloodworm.onComplete = () => {
      bloodworm.destroy();
    };
    bloodworm.play();

    this.setup.foodContainer.addChildAt(bloodworm, 0);

    return bloodworm;
  };

  render = delta => {
    const time = this.setup.ticker.lastTime - this.lastTime;
    this.lastTime = this.setup.ticker.lastTime;

    this.bloodworms.map((bloodworm, bloodwormKey) => {
      if (!this.setup.getCollision(this.setup.background.sand, bloodworm)) {
        bloodworm.position.y += 1;

        bloodworm.position.x =
          bloodworm.randomSpawnPointX +
          Math.sin((this.lastTime * (Math.PI / 10)) / 100) * 100 * delta;
      } else {
        this.bloodworms.splice(bloodwormKey, 1);
        bloodworm.destroy();
      }
    });
  };
}

export default FoodGenerator;
