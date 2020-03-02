import * as PIXI from "pixi.js";
import Target from "./../Target.js";

class Bloodworm extends Target {
  constructor(setup) {
    super(setup);
    this.setup = setup;
    setup.debugLog("new Bloodworm");
    this.pixiObj = this.addPixiObj();
    this.stats.health = 10;
    this.stats.speed = Math.random() + 1;
    this.stats.attack = 0;
    this.stats.loot.xp = 2;
  }

  addPixiObj = () => {
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

    this.randomSpawnPointY = this.setup.renderer.screen.height * -1;
    bloodworm.position.y = this.randomSpawnPointY;

    this.randomSpawnPointX =
      this.setup.offset.x + this.setup.renderer.screen.width * Math.random();
    bloodworm.position.x = this.randomSpawnPointX;
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

    if (this.stats.health <= 0) {
      this.pixiObj.stop();
      this.dieSimple();
      return false;
    }

    if (!this.setup.getCollision(this.setup.background.sand, this.pixiObj)) {
      this.pixiObj.position.y += 1;

      this.pixiObj.position.x =
        this.randomSpawnPointX +
        Math.sin(this.lastTime * (Math.PI / 2000)) *
          100 *
          delta *
          this.stats.speed;
    } else {
      return false;
    }
    return true;
  };
}

export default Bloodworm;
