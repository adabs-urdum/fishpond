import * as PIXI from "pixi.js";

class FoodGenerator {
  constructor(setup) {
    this.setup = setup;
    this.setup.debugLog("new FoodGenerator");

    this.stats = {
      bloodworm: {
        life: 10
      }
    };

    this.bloodworms = [];
    this.bloodworms.push(this.addBloodWorm());
    setInterval(() => {
      console.log("new BloodWorm");

      this.bloodworms.push(this.addBloodWorm());
    }, 2737);
  }

  addBloodSplatter = () => {
    const bloodSplatterFrames = [];
    const bloodSplatterTexture = this.setup.loader.resources["bloodSplatter"]
      .texture;
    for (let i = 0; i < 4; i++) {
      bloodSplatterFrames.push(new PIXI.Rectangle(200 * i, 0, 200, 184));
    }
    bloodSplatterTexture.frame = bloodSplatterFrames[0];
    const bloodSplatterTextures = [];
    for (let i = 0; i < bloodSplatterFrames.length; i++) {
      const texture = bloodSplatterTexture.clone();
      texture.frame = bloodSplatterFrames[i];
      bloodSplatterTextures.push(texture);
    }

    const bloodSplatter = new PIXI.AnimatedSprite(bloodSplatterTextures);
    bloodSplatter.anchor.x = this.setup.fish.fish.direction.x == 1 ? -0.5 : 1;
    bloodSplatter.anchor.y = 0.5;
    bloodSplatter.activeMovement = true;
    bloodSplatter.first = true;
    bloodSplatter.tint = 0xe8fbff;
    const randomFactor = Math.random();
    bloodSplatter.scale.set(randomFactor * 0.4 + 0.2);

    bloodSplatter.animationSpeed = 0.3;
    bloodSplatter.loop = false;

    bloodSplatter.position.y =
      this.setup.offset.y + this.setup.renderer.screen.height / 2;
    bloodSplatter.position.x =
      this.setup.offset.x + this.setup.renderer.screen.width / 2;

    this.setup.environment.addChild(bloodSplatter);

    bloodSplatter.onComplete = () => {
      bloodSplatter.destroy();
    };

    bloodSplatter.play();
  };

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

    bloodworm.randomSpawnPointY = this.setup.renderer.screen.height * -1;
    bloodworm.position.y = bloodworm.randomSpawnPointY;

    bloodworm.randomSpawnPointX =
      this.setup.offset.x + this.setup.renderer.screen.width * Math.random();
    bloodworm.position.x = bloodworm.randomSpawnPointX;
    bloodworm.speed = Math.random() * 0.5 + 0.5;

    bloodworm.animationSpeed = 1;
    bloodworm.scale.set(0.08);
    bloodworm.loop = true;
    bloodworm.tint = 0xe8fbff;
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
          Math.sin((this.lastTime * (Math.PI / 10)) / 50) *
            100 *
            delta *
            bloodworm.speed;
      } else {
        this.bloodworms.splice(bloodwormKey, 1);
        bloodworm.destroy();
      }
    });
  };
}

export default FoodGenerator;
