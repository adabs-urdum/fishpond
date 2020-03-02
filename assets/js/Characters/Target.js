import * as PIXI from "pixi.js";

class Target {
  constructor(setup) {
    this.setup = setup;
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
    bloodSplatter.scale.set(randomFactor * 0.4 + 0.2);

    bloodSplatter.animationSpeed = 0.3;
    bloodSplatter.loop = false;

    bloodSplatter.position.x = target.position.x;
    bloodSplatter.position.y = target.position.y;

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
