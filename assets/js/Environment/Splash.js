import * as PIXI from "pixi.js";

class Splash {
  constructor(setup) {
    this.setup = setup;
    this.setup.debugLog("new Splash");

    this.addSplash();
  }

  addSplash = () => {
    const splashFrames = [];
    const splashTexture = this.setup.loader.resources["splash"].texture;
    for (let i = 0; i < 7; i++) {
      splashFrames.push(new PIXI.Rectangle(736.94 * i, 0, 736.94, 552.69));
    }
    splashTexture.frame = splashFrames[0];

    const splashTextures = [];
    for (let i = 0; i < splashFrames.length; i++) {
      const splashAnimationTexture = splashTexture.clone();
      splashAnimationTexture.frame = splashFrames[i];
      splashTextures.push(splashAnimationTexture);
    }

    const splash = new PIXI.AnimatedSprite(splashTextures);
    splash.position.x = this.setup.renderer.screen.width / 2;
    splash.position.y =
      this.setup.fish.fish.direction.x == 1
        ? this.setup.fish.fish.y - this.setup.fish.fish.height / 3
        : this.setup.fish.fish.y + this.setup.fish.fish.height / 3;
    splash.animationSpeed = 1;
    splash.scale.set(0.2, 0.11);
    splash.alpha = 0.7;
    splash.loop = false;
    splash.animationSpeed = 0.7;
    splash.anchor.x = 0.5;
    splash.anchor.y = 1;
    splash.onComplete = () => {
      splash.destroy();
    };
    splash.play();

    this.setup.stage.addChildAt(splash, 2);
  };
}

export default Splash;
