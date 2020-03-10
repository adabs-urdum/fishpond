import * as PIXI from "pixi.js";
import { GlowFilter } from "pixi-filters";

class Target {
  constructor(setup) {
    this.setup = setup;
    this.tint = 0xffffff;
    this.bloodFactor = 0.4;
    // this.setup.debugLog("new Target");

    this.stats = {
      level: 4,
      attack: 5,
      maxHealth: 20,
      health: 20,
      speed: 0,
      loot: {
        xp: 100000
      }
    };
  }

  dealAttack = defender => {
    defender.stats.health - this.stats.attack;
  };

  takeDamage = attacker => {
    this.stats.health -= attacker.stats.attack;
    this.pixiObj.filters = [
      new GlowFilter({
        distance: 10,
        outerStrength: 1.5,
        innerStrength: 0,
        color: 0xff0000
      })
    ];
    setTimeout(() => {
      this.pixiObj.filters = [];
    }, 100);
    this.afterTakeDamage();
  };

  afterTakeDamage = () => {};

  setSpriteDirection = angleDeg => {
    if (angleDeg >= 90 && angleDeg <= 180) {
      this.pixiObj.scale.y = Math.abs(this.pixiObj.scale.y) * -1;
    } else if (angleDeg <= 90 && angleDeg >= 0) {
      if (this.pixiObj.scale.y < 0) {
        this.pixiObj.scale.y *= -1;
      }
    } else if (angleDeg >= -90 && angleDeg <= 0) {
      if (this.pixiObj.scale.y < 0) {
        this.pixiObj.scale.y *= -1;
      }
    } else if (angleDeg <= -90) {
      this.pixiObj.scale.y = Math.abs(this.pixiObj.scale.y) * -1;
    }
  };

  dieSimple = () => {
    this.setup.ticker.add(this.fadeOut, this);
  };

  fadeOut = () => {
    this.pixiObj.alpha -= 0.05;
    if (this.pixiObj.alpha <= 0) {
      this.pixiObj.destroy();
      this.setup.ticker.remove(this.fadeOut, this);
    }
  };

  addBloodSplatter = target => {
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
    bloodSplatter.anchor.x = 0.5;
    bloodSplatter.anchor.y = 0.5;
    bloodSplatter.angle = Math.random() * 360;
    bloodSplatter.activeMovement = true;
    bloodSplatter.first = true;
    bloodSplatter.tint = 0xe8fbff;
    const randomFactor = Math.random();
    bloodSplatter.scale.set(
      randomFactor * this.bloodFactor + this.bloodFactor / 2
    );

    bloodSplatter.animationSpeed = 0.3;
    bloodSplatter.loop = false;

    bloodSplatter.position.x = target.position.x + target.parent.position.x;
    bloodSplatter.position.y = target.position.y + target.parent.position.y;

    this.setup.environment.addChild(bloodSplatter);

    bloodSplatter.onComplete = () => {
      bloodSplatter.destroy();
    };

    bloodSplatter.play();
  };

  render = () => {
    this.setup.debugLog("render plain target");
  };
}

export default Target;
